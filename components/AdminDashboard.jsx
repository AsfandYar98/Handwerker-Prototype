"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { siteConfig, getBookingType, getService } from "@/site.config";
import { formatDateLong, formatDateShort, nowIn, toMin } from "@/lib/time";
import { langOrDefault } from "@/lib/i18n/config";
import { withLang } from "@/lib/i18n/href";
import { t } from "@/lib/i18n/t";

// The dashboard is German only; localisable config texts are shown in German.
const de = (value) => t(value, "de");
const languageName = new Intl.DisplayNames("de", { type: "language" });

const STATUS = { requested: "Angefragt", confirmed: "Bestätigt", done: "Erledigt", cancelled: "Abgesagt" };

const TABS = [
  { key: "open", label: "Offene Anfragen" },
  { key: "upcoming", label: "Kommende Termine" },
  { key: "past", label: "Vergangen" },
  { key: "cancelled", label: "Abgesagt" },
  { key: "all", label: "Alle" },
];

function isPast(b, now) {
  if (!b.date) return false;
  if (b.date !== now.date) return b.date < now.date;
  return toMin(b.time || "00:00") + (b.durationMinutes || 0) < now.minutes;
}

function inTab(b, tab, now) {
  switch (tab) {
    case "open":
      return b.status === "requested" && !isPast(b, now);
    case "upcoming":
      return b.status === "confirmed" && !isPast(b, now);
    case "past":
      return b.status !== "cancelled" && isPast(b, now);
    case "cancelled":
      return b.status === "cancelled";
    default:
      return true;
  }
}

// openDemo: open demo view (no login, contacts arrive masked from the API).
export default function AdminDashboard({ setup, openDemo }) {
  const [bookings, setBookings] = useState(null);
  const [blocked, setBlocked] = useState([]);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("open");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [openId, setOpenId] = useState(null);
  const [notes, setNotes] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [newBlocked, setNewBlocked] = useState("");
  const now = nowIn(siteConfig.timezone);

  const load = useCallback(async () => {
    try {
      const [b, bl] = await Promise.all([
        fetch("/api/admin/bookings", { cache: "no-store" }),
        fetch("/api/admin/blocked", { cache: "no-store" }),
      ]);
      if (b.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const bj = await b.json();
      const blj = await bl.json();
      setBookings(bj.bookings || []);
      setBlocked(blj.blocked || []);
      setError("");
    } catch {
      setError("Daten konnten nicht geladen werden. Prüfen Sie die Verbindung und laden Sie neu.");
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  // Open requests first; if there are none, show upcoming.
  useEffect(() => {
    if (bookings && tab === "open" && !bookings.some((b) => inTab(b, "open", now))) setTab("upcoming");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  const counts = useMemo(() => {
    const c = {};
    for (const t of TABS) c[t.key] = (bookings || []).filter((b) => inTab(b, t.key, now)).length;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = (bookings || []).filter((b) => inTab(b, tab, now));
    if (typeFilter) list = list.filter((b) => b.type === typeFilter);
    if (q) {
      list = list.filter((b) =>
        [b.ref, b.customer?.name, b.customer?.email, b.customer?.phone, b.customer?.street, b.customer?.zip]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    const key = (b) => `${b.date || "9999"}T${b.time || "00:00"}`;
    list.sort((a, b) => (tab === "past" || tab === "cancelled" ? key(b).localeCompare(key(a)) : key(a).localeCompare(key(b))));
    const groups = [];
    for (const b of list) {
      const g = groups.at(-1);
      if (g && g.date === b.date) g.items.push(b);
      else groups.push({ date: b.date, items: [b] });
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, tab, query, typeFilter]);

  const todayCount = (bookings || []).filter((b) => b.date === now.date && b.status !== "cancelled").length;

  async function patch(id, body) {
    setBusyId(id);
    setActionError("");
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Änderung fehlgeschlagen.");
      setBookings((list) => list.map((b) => (b.id === id ? data.booking : b)));
      if (typeof body.notes === "string") setNotes((n) => ({ ...n, [id]: undefined }));
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusyId(null);
    }
  }

  async function changeBlocked(method, date) {
    const res = await fetch("/api/admin/blocked", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    const data = await res.json();
    if (res.ok) {
      setBlocked(data.blocked);
      setNewBlocked("");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  function detail(b) {
    const type = getBookingType(b.type);
    const service = getService(b.service);
    const cust = b.customer || {};
    const d = b.details || {};
    const address = cust.street ? `${cust.street}, ${cust.zip} ${cust.city}` : "";
    const draft = notes[b.id] ?? b.notes ?? "";
    const busy = busyId === b.id;
    return (
      <div className="bk-body">
        <dl className="kv">
          <dt>Kunde</dt>
          <dd>{cust.name}</dd>
          {langOrDefault(b.lang) !== "de" && (
            <>
              <dt>Sprache</dt>
              <dd>{languageName.of(b.lang)}</dd>
            </>
          )}
          <dt>Kontakt</dt>
          <dd>
            {cust.phone && (openDemo ? cust.phone : <a href={`tel:${cust.phone.replace(/[^\d+]/g, "")}`}>{cust.phone}</a>)}
            {cust.phone && cust.email && " · "}
            {cust.email && (openDemo ? cust.email : <a href={`mailto:${cust.email}`}>{cust.email}</a>)}
          </dd>
          {address && (
            <>
              <dt>Adresse</dt>
              <dd>
                {openDemo ? (
                  address
                ) : (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener">
                    {address}
                  </a>
                )}
              </dd>
            </>
          )}
          <dt>Termin</dt>
          <dd>
            {b.date ? `${formatDateLong(b.date, siteConfig.locale)}, ${b.time} Uhr` : "–"} ({b.durationMinutes} Min., {de(type?.name)})
          </dd>
          <dt>Leistung</dt>
          <dd>{de(service?.name) || "Noch offen"}</dd>
          {(d.bathroomSize || d.timeframe) && (
            <>
              <dt>Bad / Zeitraum</dt>
              <dd>{[d.bathroomSize, d.timeframe].filter(Boolean).join(" · ")}</dd>
            </>
          )}
          {d.message && (
            <>
              <dt>Nachricht</dt>
              <dd style={{ fontWeight: 400 }}>{d.message}</dd>
            </>
          )}
          {(d.answers || []).map((a) => (
            <Fragment key={a.question}>
              <dt>{a.question}</dt>
              <dd style={{ fontWeight: 400 }}>{a.answer}</dd>
            </Fragment>
          ))}
          {b.meetingUrl && (
            <>
              <dt>Meeting-Link</dt>
              <dd>
                <a href={b.meetingUrl} target="_blank" rel="noopener">
                  {b.meetingUrl}
                </a>
              </dd>
            </>
          )}
          <dt>Quelle</dt>
          <dd>{b.source === "calendly" ? "Calendly" : "Website"} · Nr. {b.ref}</dd>
        </dl>

        <div className="field" style={{ marginBottom: 12 }}>
          <label htmlFor={`n-${b.id}`}>Interne Notiz</label>
          <textarea
            id={`n-${b.id}`}
            className="textarea"
            style={{ minHeight: 70 }}
            value={draft}
            onChange={(e) => setNotes((n) => ({ ...n, [b.id]: e.target.value }))}
            placeholder="z. B. Parkplatz im Hof, Fliesenmuster mitbringen"
          />
          {notes[b.id] !== undefined && notes[b.id] !== (b.notes || "") && (
            <div>
              <button type="button" className="btn btn-small" disabled={busy} onClick={() => patch(b.id, { notes: draft })}>
                Notiz speichern
              </button>
            </div>
          )}
        </div>

        <div className="actions">
          {b.status === "requested" && (
            <button type="button" className="btn btn-small" disabled={busy} onClick={() => patch(b.id, { status: "confirmed" })}>
              Bestätigen und Kunde informieren
            </button>
          )}
          {b.status === "confirmed" && (
            <button type="button" className="btn btn-small btn-ghost" disabled={busy} onClick={() => patch(b.id, { status: "done" })}>
              Als erledigt markieren
            </button>
          )}
          {b.status !== "cancelled" && b.source === "website" && (
            <button
              type="button"
              className="btn btn-small btn-danger"
              disabled={busy}
              onClick={() => {
                if (window.confirm(`Termin ${b.ref} absagen? ${cust.name} bekommt eine E-Mail.`)) patch(b.id, { status: "cancelled" });
              }}
            >
              Absagen
            </button>
          )}
          {b.status !== "cancelled" && b.source === "calendly" && b.calendly?.cancelUrl && (
            <a href={b.calendly.cancelUrl} target="_blank" rel="noopener" className="btn btn-small btn-danger">
              In Calendly absagen
            </a>
          )}
          {b.status === "cancelled" && b.source === "website" && (
            <button type="button" className="btn btn-small btn-ghost" disabled={busy} onClick={() => patch(b.id, { status: "confirmed" })}>
              Wiederherstellen
            </button>
          )}
          {b.date && (
            <a href={`/api/bookings/${b.id}/ics`} className="btn btn-small btn-ghost">
              Kalenderdatei
            </a>
          )}
        </div>

        {b.history?.length > 0 && (
          <ul className="history plain-list">
            {b.history.map((h, i) => (
              <li key={i}>
                {new Date(h.at).toLocaleString(siteConfig.locale, { dateStyle: "short", timeStyle: "short", timeZone: siteConfig.timezone })}{" "}
                – {h.action}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-bar">
        <div className="wrap">
          <strong>{siteConfig.company.brand} – Dashboard</strong>
          <span style={{ display: "flex", gap: 18, alignItems: "center" }}>
            {openDemo && <span className="admin-badge">Demo-Ansicht</span>}
            <Link href={withLang("de", "/")}>Zur Website</Link>
            {!openDemo && (
              <button type="button" className="link-btn" onClick={logout}>
                Abmelden
              </button>
            )}
          </span>
        </div>
      </div>

      <div className="wrap admin-main">
        <div className="admin-top">
          <div>
            <h1>Termine</h1>
            <p className="today-line">
              {formatDateLong(now.date, siteConfig.locale)}: {todayCount === 0 ? "heute keine Termine" : `${todayCount} Termin${todayCount > 1 ? "e" : ""} heute`}
              {counts.open > 0 && `, ${counts.open} offene Anfrage${counts.open > 1 ? "n" : ""}`}
            </p>
          </div>
          <div className="actions">
            <button type="button" className="btn btn-small btn-ghost" onClick={load}>
              Aktualisieren
            </button>
            <Link href={withLang("de", "/termin")} className="btn btn-small" target="_blank">
              Termin eintragen
            </Link>
          </div>
        </div>

        <div className="admin-layout">
          <div>
            <div className="tabs" role="tablist" aria-label="Termine filtern">
              {TABS.map((t) => (
                <button key={t.key} type="button" role="tab" className="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}>
                  {t.label}
                  <span className="count">{counts[t.key] ?? 0}</span>
                </button>
              ))}
            </div>

            <div className="toolbar">
              <label className="visually-hidden" htmlFor="q">
                Suchen
              </label>
              <input
                id="q"
                className="input"
                type="search"
                placeholder="Name, E-Mail, Telefon, PLZ oder Buchungsnummer"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <label className="visually-hidden" htmlFor="tf">
                Terminart
              </label>
              <select id="tf" className="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">Alle Terminarten</option>
                {siteConfig.bookingTypes.map((bt) => (
                  <option key={bt.key} value={bt.key}>
                    {de(bt.name)}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="alert" role="alert">
                {error}
              </p>
            )}
            {actionError && (
              <p className="alert" role="alert" style={{ marginBottom: 12 }}>
                {actionError}
              </p>
            )}
            {!bookings && !error && <p className="loading">Termine werden geladen …</p>}
            {bookings && visible.length === 0 && (
              <p className="empty">
                {tab === "open" ? "Keine offenen Anfragen. Neue Buchungen erscheinen hier automatisch." : "Hier ist nichts – passen Sie Filter oder Suche an."}
              </p>
            )}

            {visible.map((g) => (
              <section key={g.date || "none"} className="day-group">
                <h2>
                  {g.date ? formatDateLong(g.date, siteConfig.locale) : "Ohne Datum"}
                  {g.date === now.date && " (heute)"}
                </h2>
                {g.items.map((b) => {
                  const open = openId === b.id;
                  const type = getBookingType(b.type);
                  return (
                    <article key={b.id} className="bk" data-status={b.status}>
                      <button type="button" className="bk-head" aria-expanded={open} onClick={() => setOpenId(open ? null : b.id)}>
                        <span className="bk-time">{b.time || "–"}</span>
                        <span className="bk-who">
                          <strong>{b.customer?.name || "Unbekannt"}</strong>
                          <span>
                            {de(type?.name)}
                            {b.customer?.zip ? ` · ${b.customer.zip} ${b.customer.city || ""}` : ""}
                            {b.source === "calendly" ? " · Calendly" : ""}
                          </span>
                        </span>
                        <span className={`pill pill-${b.status}`}>{STATUS[b.status]}</span>
                      </button>
                      {open && detail(b)}
                    </article>
                  );
                })}
              </section>
            ))}
          </div>

          <aside>
            <div className="side-card">
              <h2>Geschlossene Tage</h2>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>An diesen Tagen kann online niemand buchen, z. B. Urlaub oder Feiertage.</p>
              <form
                className="toolbar"
                style={{ marginTop: 12, marginBottom: 0 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newBlocked) changeBlocked("POST", newBlocked);
                }}
              >
                <label className="visually-hidden" htmlFor="nb">
                  Datum
                </label>
                <input id="nb" className="input" type="date" min={now.date} value={newBlocked} onChange={(e) => setNewBlocked(e.target.value)} />
                <button className="btn btn-small" type="submit" disabled={!newBlocked}>
                  Schließen
                </button>
              </form>
              {blocked.length > 0 && (
                <ul className="blocked-list">
                  {blocked.map((d) => (
                    <li key={d}>
                      {formatDateShort(d, siteConfig.locale)}
                      <button type="button" className="link-btn" onClick={() => changeBlocked("DELETE", d)}>
                        Wieder öffnen
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="side-card">
              <h2>Einrichtung</h2>
              <ul className="setup-list">
                <li>
                  <span className={`dot ${setup.storage === "redis" ? "on" : "warn"}`} />
                  <span>
                    {setup.storage === "redis"
                      ? "Datenbank verbunden (Redis)."
                      : "Ohne Datenbank: Buchungen gehen beim nächsten Neustart verloren. Upstash Redis in Vercel verbinden."}
                  </span>
                </li>
                <li>
                  <span className={`dot ${setup.mail ? "on" : "warn"}`} />
                  <span>
                    {setup.mail
                      ? `E-Mail-Versand aktiv. Benachrichtigungen an: ${setup.notifyTo.length ? setup.notifyTo.join(", ") : "niemanden (NOTIFY_EMAIL setzen)"}.`
                      : "E-Mail-Versand aus: RESEND_API_KEY setzen, damit Kunde und Betrieb Bestätigungen und Video-Links bekommen."}
                  </span>
                </li>
                <li>
                  <span className={`dot ${setup.calendlyUrl ? "on" : ""}`} />
                  <span>
                    {setup.calendlyUrl
                      ? "Video-Beratung läuft über Calendly. Calendly verschickt Bestätigung und Meeting-Link an beide Seiten."
                      : "Video-Beratung über eigenen Kalender mit Jitsi-Link. Für Calendly NEXT_PUBLIC_CALENDLY_URL setzen."}
                  </span>
                </li>
                {setup.calendlyUrl && (
                  <li>
                    <span className={`dot ${setup.calendlyToken && setup.calendlyWebhook ? "on" : "warn"}`} />
                    <span>
                      {setup.calendlyToken ? "Calendly-API verbunden" : "CALENDLY_TOKEN fehlt (Uhrzeit/Link werden nicht übernommen)"}
                      {setup.calendlyWebhook ? ", Webhook aktiv." : ", Webhook nicht eingerichtet (Absagen in Calendly kommen nicht an)."}
                    </span>
                  </li>
                )}
                <li>
                  <span className={`dot ${openDemo ? "warn" : "on"}`} />
                  <span>
                    {openDemo
                      ? "Dashboard ohne Login offen (Kontaktdaten maskiert). ADMIN_PASSWORD setzen, um es zu sperren."
                      : "Eigenes Admin-Passwort gesetzt."}
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
