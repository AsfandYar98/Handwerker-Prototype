"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig, getBookingType, getService, usesCalendly } from "@/site.config";
import { dayParts, formatDateLong } from "@/lib/time";
import { calendlyEmbedUrl } from "@/lib/calendly-url";
import CalendlyEmbed from "./CalendlyEmbed";

const SIZES = ["unter 6 m²", "6–10 m²", "über 10 m²", "Weiß ich nicht"];
const TIMEFRAMES = ["So bald wie möglich", "In 1–3 Monaten", "In 3–6 Monaten", "Flexibel"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  street: "",
  zip: "",
  city: "Berlin",
  bathroomSize: "",
  timeframe: "",
  message: "",
  consent: false,
  website: "",
};

export default function BookingWizard({ initialService, initialType }) {
  const c = siteConfig.company;
  const [step, setStep] = useState(() => (initialService ? (initialType ? 2 : 1) : 0));
  const [service, setService] = useState(initialService || "");
  const [typeKey, setTypeKey] = useState(initialType || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState(null);
  const [slots, setSlots] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const headingRef = useRef(null);

  const type = getBookingType(typeKey);
  const calendly = usesCalendly(type);
  const serviceObj = getService(service);
  const onsite = type?.mode === "onsite";

  const labels = calendly
    ? ["Leistung", "Terminart", "Ihre Angaben", "Termin wählen"]
    : ["Leistung", "Terminart", "Termin wählen", "Ihre Angaben"];

  // Move focus to the step heading when the step changes (keyboard / screen reader users).
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  // Load the day overview when we reach the date step (own calendar only).
  useEffect(() => {
    if (!type || calendly || step !== 2) return;
    let stop = false;
    setDays(null);
    setLoadError("");
    fetch(`/api/slots?type=${type.key}&days=28`)
      .then((r) => r.json())
      .then((d) => {
        if (stop) return;
        if (d.error) throw new Error(d.error);
        setDays(d.days);
        const first = d.days.find((x) => x.free > 0);
        setDate((cur) => (cur && d.days.some((x) => x.date === cur && x.free > 0) ? cur : first ? first.date : ""));
      })
      .catch((e) => !stop && setLoadError(e.message || "Termine konnten nicht geladen werden."));
    return () => {
      stop = true;
    };
  }, [type, calendly, step]);

  const loadSlots = useCallback(() => {
    if (!type || !date) return;
    setSlots(null);
    fetch(`/api/slots?type=${type.key}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSlots(d.slots);
      })
      .catch((e) => setLoadError(e.message || "Uhrzeiten konnten nicht geladen werden."));
  }, [type, date]);

  useEffect(() => {
    if (step === 2 && !calendly) loadSlots();
  }, [step, calendly, loadSlots]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateContact() {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Bitte geben Sie Ihren Namen an.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (form.phone.replace(/\D/g, "").length < 6) e.phone = "Bitte geben Sie eine Telefonnummer an.";
    if (onsite) {
      if (!form.street.trim()) e.street = "Bitte geben Sie Straße und Hausnummer an.";
      if (!/^\d{5}$/.test(form.zip.trim())) e.zip = "Bitte geben Sie eine fünfstellige PLZ an.";
      if (!form.city.trim()) e.city = "Bitte geben Sie den Ort an.";
    }
    if (!form.consent) e.consent = "Bitte stimmen Sie der Datenverarbeitung zu.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validateContact()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: typeKey, service: service || "unsicher", date, time }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.field) setErrors((e) => ({ ...e, [data.field]: data.error }));
        if (res.status === 409) {
          setTime("");
          setStep(2);
          loadSlots();
        }
        throw new Error(data.error || "Die Buchung hat nicht geklappt.");
      }
      setResult({ ...data.booking, token: data.token });
      setStep(4);
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onCalendlyScheduled({ eventUri, inviteeUri }) {
    setStep(4);
    setResult({ calendly: true, pending: true });
    try {
      const res = await fetch("/api/calendly/booked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventUri,
          inviteeUri,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          service,
        }),
      });
      const data = await res.json();
      setResult({ calendly: true, ...data });
    } catch {
      setResult({ calendly: true });
    }
  }

  const calendlyUrl = useMemo(
    () =>
      calendly
        ? calendlyEmbedUrl(siteConfig.calendly.url, {
            name: form.name,
            email: form.email,
            phone: form.phone,
            message: form.message,
            service: serviceObj?.name,
          })
        : "",
    // Only rebuild once the contact step is done, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calendly, step === 3]
  );

  const stepState = (i) => (i < step ? "done" : i === step ? "current" : "todo");

  // ── Render helpers ─────────────────────────────────────────────────────

  function heading(children, sub) {
    return (
      <>
        <h2 ref={headingRef} tabIndex={-1} style={{ outline: "none" }}>
          {children}
        </h2>
        {sub && <p className="sub">{sub}</p>}
      </>
    );
  }

  function Field({ name, label, type: inputType = "text", autoComplete, full, hint, inputMode }) {
    return (
      <div className={`field${full ? " full" : ""}`}>
        <label htmlFor={`f-${name}`}>{label}</label>
        <input
          id={`f-${name}`}
          className="input"
          type={inputType}
          value={form[name]}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={errors[name] ? "true" : undefined}
          aria-describedby={errors[name] ? `e-${name}` : hint ? `h-${name}` : undefined}
          onChange={(e) => update(name, e.target.value)}
        />
        {hint && !errors[name] && (
          <span className="hint" id={`h-${name}`}>
            {hint}
          </span>
        )}
        {errors[name] && (
          <span className="field-error" id={`e-${name}`}>
            {errors[name]}
          </span>
        )}
      </div>
    );
  }

  function contactFields() {
    return (
      <div className="form-grid">
        {Field({ name: "name", label: "Vor- und Nachname", autoComplete: "name", full: true })}
        {Field({ name: "email", label: "E-Mail", type: "email", autoComplete: "email", hint: "Hierhin schicken wir die Bestätigung." })}
        {Field({ name: "phone", label: "Telefon", type: "tel", autoComplete: "tel", inputMode: "tel", hint: "Falls wir kurzfristig etwas klären müssen." })}
        {onsite && (
          <>
            {Field({ name: "street", label: "Straße und Hausnummer", autoComplete: "street-address", full: true })}
            {Field({ name: "zip", label: "PLZ", autoComplete: "postal-code", inputMode: "numeric" })}
            {Field({ name: "city", label: "Ort", autoComplete: "address-level2" })}
          </>
        )}
        <div className="field">
          <label htmlFor="f-size">Größe des Bades</label>
          <select id="f-size" className="select" value={form.bathroomSize} onChange={(e) => update("bathroomSize", e.target.value)}>
            <option value="">Bitte wählen</option>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-time">Wann soll es losgehen?</label>
          <select id="f-time" className="select" value={form.timeframe} onChange={(e) => update("timeframe", e.target.value)}>
            <option value="">Bitte wählen</option>
            {TIMEFRAMES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="f-msg">Was sollen wir vorab wissen? (optional)</label>
          <textarea
            id="f-msg"
            className="textarea"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="z. B. Wanne gegen Dusche tauschen, Altbau, 3. OG ohne Aufzug"
          />
        </div>
        <div className="full hp" aria-hidden="true">
          <label htmlFor="f-website">Website</label>
          <input id="f-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
        </div>
        <div className="full">
          <label className="consent">
            <input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} />
            <span>
              Ich habe die{" "}
              <a href={c.privacyUrl} target="_blank" rel="noopener">
                Datenschutzerklärung
              </a>{" "}
              gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden.
            </span>
          </label>
          {errors.consent && <span className="field-error">{errors.consent}</span>}
        </div>
      </div>
    );
  }

  // ── Steps ──────────────────────────────────────────────────────────────

  let body = null;

  if (step === 0) {
    body = (
      <>
        {heading("Worum geht es?", "Wählen Sie die Leistung, die Sie interessiert. Unsicher? Kein Problem – wir beraten Sie.")}
        <div className="choice-grid">
          {siteConfig.services.map((s) => (
            <button
              key={s.slug}
              type="button"
              className="choice"
              aria-pressed={service === s.slug}
              onClick={() => {
                setService(s.slug);
                setStep(typeKey ? 2 : 1);
              }}
            >
              <strong>{s.name}</strong>
              <span>{s.short}</span>
            </button>
          ))}
          <button
            type="button"
            className="choice"
            aria-pressed={service === "unsicher"}
            onClick={() => {
              setService("unsicher");
              setStep(typeKey ? 2 : 1);
            }}
          >
            <strong>Noch unsicher</strong>
            <span>Wir finden gemeinsam heraus, was Ihr Bad braucht.</span>
          </button>
        </div>
      </>
    );
  }

  if (step === 1) {
    body = (
      <>
        {heading("Wie möchten Sie starten?", "Beide Termine sind kostenlos und unverbindlich.")}
        <div className="choice-grid">
          {siteConfig.bookingTypes.map((t) => (
            <button
              key={t.key}
              type="button"
              className="choice"
              aria-pressed={typeKey === t.key}
              onClick={() => {
                setTypeKey(t.key);
                setTime("");
                setStep(2);
              }}
            >
              <strong>{t.name}</strong>
              <span>{t.description}</span>
              <span className="tag">
                {t.durationMinutes} Min. · {t.price}
              </span>
            </button>
          ))}
        </div>
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
            Zurück
          </button>
        </div>
      </>
    );
  }

  if (step === 2 && !calendly && type) {
    body = (
      <>
        {heading("Wann passt es Ihnen?", `${type.name}, ${type.durationMinutes} Minuten. Angezeigt werden alle freien Termine der nächsten vier Wochen.`)}
        {loadError && (
          <p className="alert" role="alert">
            {loadError}
          </p>
        )}
        {!days && !loadError && <p className="loading">Freie Termine werden geladen …</p>}
        {days && (
          <>
            <div className="label" id="day-label" style={{ fontWeight: 600, marginBottom: 8 }}>
              Tag
            </div>
            <div className="days" role="group" aria-labelledby="day-label">
              {days.map((d) => {
                const p = dayParts(d.date, siteConfig.locale);
                const disabled = d.free === 0;
                return (
                  <button
                    key={d.date}
                    type="button"
                    className="day"
                    disabled={disabled}
                    aria-pressed={date === d.date}
                    aria-label={`${formatDateLong(d.date, siteConfig.locale)}, ${disabled ? "keine freien Termine" : `${d.free} freie Termine`}`}
                    onClick={() => {
                      setDate(d.date);
                      setTime("");
                    }}
                  >
                    <small>{p.weekday}</small>
                    <strong>{p.day}</strong>
                    <small>{p.month}</small>
                    {!disabled && <span className="free">{d.free} frei</span>}
                  </button>
                );
              })}
            </div>
            {days.every((d) => d.free === 0) ? (
              <p className="notice">
                In den nächsten vier Wochen ist leider nichts mehr frei. Rufen Sie uns an: <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
              </p>
            ) : (
              date && (
                <>
                  <div className="label" id="time-label" style={{ fontWeight: 600, margin: "8px 0" }}>
                    Uhrzeit am {formatDateLong(date, siteConfig.locale)}
                  </div>
                  {!slots && <p className="loading">Uhrzeiten werden geladen …</p>}
                  {slots && (
                    <div className="times" role="group" aria-labelledby="time-label">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          className="time"
                          disabled={!s.available}
                          aria-pressed={time === s.time}
                          aria-label={`${s.time} Uhr${s.available ? "" : ", belegt"}`}
                          onClick={() => setTime(s.time)}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )
            )}
          </>
        )}
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
            Zurück
          </button>
          <button type="button" className="btn" disabled={!date || !time} onClick={() => setStep(3)}>
            Weiter zu Ihren Angaben
          </button>
        </div>
      </>
    );
  }

  if ((step === 3 && !calendly) || (step === 2 && calendly)) {
    const finalStep = !calendly;
    body = (
      <>
        {heading("Ihre Angaben", finalStep
              ? onsite
                ? "Wir kommen zu Ihnen. Die Adresse brauchen wir für die Anfahrt."
                : "Den Link zur Video-Beratung schicken wir Ihnen und uns per E-Mail."
              : "Im nächsten Schritt wählen Sie Ihren Termin. Ihre Angaben sind dort schon eingetragen.")}
        {contactFields()}
        {submitError && (
          <p className="alert" role="alert" style={{ marginTop: 18 }}>
            {submitError}
          </p>
        )}
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(finalStep ? 2 : 1)}>
            Zurück
          </button>
          {finalStep ? (
            <button type="button" className="btn" disabled={submitting} onClick={submit}>
              {submitting ? "Wird gebucht …" : onsite ? "Besichtigung anfragen" : "Video-Beratung buchen"}
            </button>
          ) : (
            <button type="button" className="btn" onClick={() => validateContact() && setStep(3)}>
              Weiter zur Terminauswahl
            </button>
          )}
        </div>
      </>
    );
  }

  if (step === 3 && calendly) {
    body = (
      <>
        {heading("Termin wählen", "Wählen Sie einen freien Termin. Die Bestätigung mit dem Meeting-Link bekommen Sie und wir automatisch per E-Mail.")}
        <CalendlyEmbed url={calendlyUrl} onScheduled={onCalendlyScheduled} />
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
            Zurück
          </button>
        </div>
      </>
    );
  }

  if (step === 4 && result) {
    if (result.calendly) {
      body = (
        <>
          <div className="done-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          {heading("Ihre Video-Beratung ist gebucht")}
          <p>
            Calendly hat Ihnen gerade eine Bestätigung mit dem Meeting-Link an <strong>{form.email}</strong> geschickt. Wir haben
            dieselbe Einladung erhalten.
          </p>
          <dl className="kv">
            {result.ref && (
              <>
                <dt>Buchungsnummer</dt>
                <dd>{result.ref}</dd>
              </>
            )}
            {result.date && (
              <>
                <dt>Termin</dt>
                <dd>
                  {formatDateLong(result.date, siteConfig.locale)}, {result.time} Uhr
                </dd>
              </>
            )}
            {result.meetingUrl && (
              <>
                <dt>Meeting-Link</dt>
                <dd>
                  <a href={result.meetingUrl} target="_blank" rel="noopener">
                    {result.meetingUrl}
                  </a>
                </dd>
              </>
            )}
          </dl>
          {result.pending && <p className="loading">Buchung wird gespeichert …</p>}
          <div className="actions">
            <Link href="/" className="btn btn-ghost">
              Zur Startseite
            </Link>
          </div>
        </>
      );
    } else {
      const confirmed = result.status === "confirmed";
      const manage = `/buchung/${result.id}?t=${result.token}`;
      body = (
        <>
          <div className="done-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          {heading(confirmed ? (result.meetingUrl ? "Ihre Video-Beratung ist gebucht" : "Ihr Termin ist gebucht") : "Ihre Anfrage ist eingegangen")}
          <p>
            {confirmed
              ? `Wir haben Ihnen eine Bestätigung an ${form.email} geschickt${result.meetingUrl ? " – mit dem Link zum Gespräch. Wir haben denselben Link erhalten." : "."}`
              : `Wir prüfen den Termin und bestätigen ihn in der Regel innerhalb eines Werktags per E-Mail an ${form.email}.`}
          </p>
          <dl className="kv">
            <dt>Buchungsnummer</dt>
            <dd>{result.ref}</dd>
            <dt>Termin</dt>
            <dd>
              {formatDateLong(result.date, siteConfig.locale)}, {result.time} Uhr
            </dd>
            <dt>Art</dt>
            <dd>{type?.name}</dd>
            {result.meetingUrl && (
              <>
                <dt>Video-Link</dt>
                <dd>
                  <a href={result.meetingUrl} target="_blank" rel="noopener">
                    {result.meetingUrl}
                  </a>
                </dd>
              </>
            )}
          </dl>
          <div className="actions">
            <a href={`/api/bookings/${result.id}/ics?t=${result.token}`} className="btn">
              Zum Kalender hinzufügen
            </a>
            <Link href={manage} className="btn btn-ghost">
              Buchung verwalten
            </Link>
          </div>
        </>
      );
    }
  }

  return (
    <div className="booking wrap">
      <div>
        {step < 4 && (
          <ol className="steps" aria-label="Fortschritt">
            {labels.map((l, i) => (
              <li key={l} data-state={stepState(i)} aria-current={i === step ? "step" : undefined}>
                <span>{l}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="panel">{body}</div>
      </div>

      <aside className="summary" aria-label="Ihre Auswahl">
        <h2>Ihre Auswahl</h2>
        <dl>
          <div>
            <dt>Leistung</dt>
            <dd>{serviceObj ? serviceObj.name : service === "unsicher" ? "Noch unsicher" : "–"}</dd>
          </div>
          <div>
            <dt>Terminart</dt>
            <dd>{type ? `${type.name} (${type.durationMinutes} Min.)` : "–"}</dd>
          </div>
          {!calendly && (
            <div>
              <dt>Termin</dt>
              <dd>{date && time ? `${formatDateLong(date, siteConfig.locale)}, ${time} Uhr` : "–"}</dd>
            </div>
          )}
        </dl>
        <p className="help">
          Lieber telefonisch? <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
          <br />
          {c.openingHours}
        </p>
      </aside>
    </div>
  );
}
