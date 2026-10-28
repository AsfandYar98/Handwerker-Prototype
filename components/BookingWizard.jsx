"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig, getBookingType, getService, usesCalendly } from "@/site.config";
import { dayParts } from "@/lib/time";
import { calendlyEmbedUrl } from "@/lib/calendly-url";
import { localeFor } from "@/lib/i18n/config";
import { fill, formatClock, formatDate, formatDateTime, formatDuration } from "@/lib/i18n/format";
import { withLang } from "@/lib/i18n/href";
import { t } from "@/lib/i18n/t";
import CalendlyEmbed from "./CalendlyEmbed";

// Option keys are what the form sends; the API stores the German label so the
// company side stays German whatever language the customer used.
const SIZES = ["small", "medium", "large", "unknown"];
const TIMEFRAMES = ["asap", "soon", "later", "flexible"];

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

/** A dictionary string with one {placeholder} replaced by a React node (link, <strong> …). */
function withNode(template, key, node) {
  const [before, after = ""] = template.split(`{${key}}`);
  return (
    <>
      {before}
      {node}
      {after}
    </>
  );
}

export default function BookingWizard({ lang, dict, initialService, initialType }) {
  const c = siteConfig.company;
  const locale = localeFor(lang);
  const tx = (value) => t(value, lang);
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
  const daysError = dict["wizard.daysError"];
  const timesError = dict["wizard.timesError"];

  const labels = calendly
    ? [dict["wizard.step.service"], dict["wizard.step.type"], dict["wizard.step.details"], dict["wizard.step.slot"]]
    : [dict["wizard.step.service"], dict["wizard.step.type"], dict["wizard.step.slot"], dict["wizard.step.details"]];

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
      .catch(() => !stop && setLoadError(daysError));
    return () => {
      stop = true;
    };
  }, [type, calendly, step, daysError]);

  const loadSlots = useCallback(() => {
    if (!type || !date) return;
    setSlots(null);
    fetch(`/api/slots?type=${type.key}&date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setSlots(d.slots);
      })
      .catch(() => setLoadError(timesError));
  }, [type, date, timesError]);

  useEffect(() => {
    if (step === 2 && !calendly) loadSlots();
  }, [step, calendly, loadSlots]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateContact() {
    const e = {};
    if (form.name.trim().length < 2) e.name = dict["error.name"];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = dict["error.email"];
    if (form.phone.replace(/\D/g, "").length < 6) e.phone = dict["error.phone"];
    if (onsite) {
      if (!form.street.trim()) e.street = dict["error.street"];
      if (!/^\d{5}$/.test(form.zip.trim())) e.zip = dict["error.zip"];
      if (!form.city.trim()) e.city = dict["error.city"];
    }
    if (!form.consent) e.consent = dict["error.consent"];
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
        body: JSON.stringify({ ...form, type: typeKey, service: service || "unsicher", date, time, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.field) setErrors((e) => ({ ...e, [data.field]: data.error }));
        if (res.status === 409) {
          setTime("");
          setStep(2);
          loadSlots();
        }
        // 4xx messages come localised from the API; server errors get the generic text.
        throw new Error(res.status >= 500 ? dict["error.generic"] : data.error || dict["wizard.submitFailed"]);
      }
      setResult({ ...data.booking, token: data.token });
      setStep(4);
    } catch (e) {
      // fetch() itself rejects with a TypeError (offline etc.) whose text is browser-specific.
      setSubmitError(e instanceof TypeError ? dict["error.generic"] : e.message);
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
          lang,
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
            service: serviceObj ? t(serviceObj.name, lang) : undefined,
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
        {Field({ name: "name", label: dict["field.name"], autoComplete: "name", full: true })}
        {Field({ name: "email", label: dict["field.email"], type: "email", autoComplete: "email", hint: dict["field.emailHint"] })}
        {Field({ name: "phone", label: dict["field.phone"], type: "tel", autoComplete: "tel", inputMode: "tel", hint: dict["field.phoneHint"] })}
        {onsite && (
          <>
            {Field({ name: "street", label: dict["field.street"], autoComplete: "street-address", full: true })}
            {Field({ name: "zip", label: dict["field.zip"], autoComplete: "postal-code", inputMode: "numeric" })}
            {Field({ name: "city", label: dict["field.city"], autoComplete: "address-level2" })}
          </>
        )}
        <div className="field">
          <label htmlFor="f-size">{dict["field.size"]}</label>
          <select id="f-size" className="select" value={form.bathroomSize} onChange={(e) => update("bathroomSize", e.target.value)}>
            <option value="">{dict["field.choose"]}</option>
            {SIZES.map((k) => (
              <option key={k} value={k}>
                {dict[`option.size.${k}`]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-time">{dict["field.timeframe"]}</label>
          <select id="f-time" className="select" value={form.timeframe} onChange={(e) => update("timeframe", e.target.value)}>
            <option value="">{dict["field.choose"]}</option>
            {TIMEFRAMES.map((k) => (
              <option key={k} value={k}>
                {dict[`option.timeframe.${k}`]}
              </option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="f-msg">{dict["field.message"]}</label>
          <textarea
            id="f-msg"
            className="textarea"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder={dict["field.messagePlaceholder"]}
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
              {withNode(
                dict["field.consent"],
                "link",
                <a href={c.privacyUrl} target="_blank" rel="noopener">
                  {dict["field.privacy"]}
                </a>
              )}
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
        {heading(dict["wizard.serviceTitle"], dict["wizard.serviceSub"])}
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
              <strong>{tx(s.name)}</strong>
              <span>{tx(s.short)}</span>
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
            <strong>{dict["booking.unsure"]}</strong>
            <span>{dict["wizard.unsureText"]}</span>
          </button>
        </div>
      </>
    );
  }

  if (step === 1) {
    body = (
      <>
        {heading(dict["wizard.typeTitle"], dict["wizard.typeSub"])}
        <div className="choice-grid">
          {siteConfig.bookingTypes.map((bt) => (
            <button
              key={bt.key}
              type="button"
              className="choice"
              aria-pressed={typeKey === bt.key}
              onClick={() => {
                setTypeKey(bt.key);
                setTime("");
                setStep(2);
              }}
            >
              <strong>{tx(bt.name)}</strong>
              <span>{tx(bt.description)}</span>
              <span className="tag">
                {formatDuration(bt.durationMinutes, lang, "short")} · {tx(bt.price)}
              </span>
            </button>
          ))}
        </div>
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
            {dict["wizard.back"]}
          </button>
        </div>
      </>
    );
  }

  if (step === 2 && !calendly && type) {
    body = (
      <>
        {heading(
          dict["wizard.slotTitle"],
          fill(dict["wizard.slotSub"], { type: tx(type.name), duration: formatDuration(type.durationMinutes, lang) })
        )}
        {loadError && (
          <p className="alert" role="alert">
            {loadError}
          </p>
        )}
        {!days && !loadError && <p className="loading">{dict["wizard.loadingDays"]}</p>}
        {days && (
          <>
            <div className="label" id="day-label" style={{ fontWeight: 600, marginBottom: 8 }}>
              {dict["wizard.day"]}
            </div>
            <div className="days" role="group" aria-labelledby="day-label">
              {days.map((d) => {
                const p = dayParts(d.date, locale);
                const disabled = d.free === 0;
                const longDate = formatDate(d.date, lang);
                return (
                  <button
                    key={d.date}
                    type="button"
                    className="day"
                    disabled={disabled}
                    aria-pressed={date === d.date}
                    aria-label={
                      disabled ? fill(dict["wizard.dayFull"], { date: longDate }) : fill(dict["wizard.dayFree"], { date: longDate, count: d.free })
                    }
                    onClick={() => {
                      setDate(d.date);
                      setTime("");
                    }}
                  >
                    <small>{p.weekday}</small>
                    <strong>{p.day}</strong>
                    <small>{p.month}</small>
                    {!disabled && <span className="free">{fill(dict["wizard.freeBadge"], { count: d.free })}</span>}
                  </button>
                );
              })}
            </div>
            {days.every((d) => d.free === 0) ? (
              <p className="notice">
                {dict["wizard.fullyBooked"]} <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
              </p>
            ) : (
              date && (
                <>
                  <div className="label" id="time-label" style={{ fontWeight: 600, margin: "8px 0" }}>
                    {fill(dict["wizard.timeOn"], { date: formatDate(date, lang) })}
                  </div>
                  {!slots && <p className="loading">{dict["wizard.loadingTimes"]}</p>}
                  {slots && (
                    <div className="times" role="group" aria-labelledby="time-label">
                      {slots.map((s) => {
                        const clock = formatClock(dict, lang, date, s.time);
                        return (
                          <button
                            key={s.time}
                            type="button"
                            className="time"
                            disabled={!s.available}
                            aria-pressed={time === s.time}
                            aria-label={s.available ? clock : fill(dict["wizard.timeTaken"], { time: clock })}
                            onClick={() => setTime(s.time)}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )
            )}
          </>
        )}
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
            {dict["wizard.back"]}
          </button>
          <button type="button" className="btn" disabled={!date || !time} onClick={() => setStep(3)}>
            {dict["wizard.toDetails"]}
          </button>
        </div>
      </>
    );
  }

  if ((step === 3 && !calendly) || (step === 2 && calendly)) {
    const finalStep = !calendly;
    body = (
      <>
        {heading(
          dict["wizard.detailsTitle"],
          finalStep ? (onsite ? dict["wizard.detailsOnsite"] : dict["wizard.detailsCall"]) : dict["wizard.detailsCalendly"]
        )}
        {contactFields()}
        {submitError && (
          <p className="alert" role="alert" style={{ marginTop: 18 }}>
            {submitError}
          </p>
        )}
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(finalStep ? 2 : 1)}>
            {dict["wizard.back"]}
          </button>
          {finalStep ? (
            <button type="button" className="btn" disabled={submitting} onClick={submit}>
              {submitting ? dict["wizard.submitting"] : onsite ? dict["wizard.submitOnsite"] : dict["wizard.submitCall"]}
            </button>
          ) : (
            <button type="button" className="btn" onClick={() => validateContact() && setStep(3)}>
              {dict["wizard.toCalendly"]}
            </button>
          )}
        </div>
      </>
    );
  }

  if (step === 3 && calendly) {
    body = (
      <>
        {heading(dict["wizard.calendlyTitle"], dict["wizard.calendlySub"])}
        <CalendlyEmbed
          url={calendlyUrl}
          onScheduled={onCalendlyScheduled}
          labels={{ loadError: dict["calendly.loadError"], frame: dict["calendly.frame"] }}
        />
        <div className="wizard-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
            {dict["wizard.back"]}
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
          {heading(dict["done.callBooked"])}
          <p>{withNode(dict["done.calendlyText"], "email", <strong>{form.email}</strong>)}</p>
          <dl className="kv">
            {result.ref && (
              <>
                <dt>{dict["booking.ref"]}</dt>
                <dd>{result.ref}</dd>
              </>
            )}
            {result.date && (
              <>
                <dt>{dict["booking.when"]}</dt>
                <dd>{formatDateTime(dict, lang, result.date, result.time)}</dd>
              </>
            )}
            {result.meetingUrl && (
              <>
                <dt>{dict["booking.meetingLink"]}</dt>
                <dd>
                  <a href={result.meetingUrl} target="_blank" rel="noopener">
                    {result.meetingUrl}
                  </a>
                </dd>
              </>
            )}
          </dl>
          {result.pending && <p className="loading">{dict["done.saving"]}</p>}
          <div className="actions">
            <Link href={withLang(lang, "/")} className="btn btn-ghost">
              {dict["cta.home"]}
            </Link>
          </div>
        </>
      );
    } else {
      const confirmed = result.status === "confirmed";
      const manage = withLang(lang, `/buchung/${result.id}?t=${result.token}`);
      const title = confirmed ? (result.meetingUrl ? dict["done.callBooked"] : dict["done.booked"]) : dict["done.requested"];
      const text = confirmed
        ? result.meetingUrl
          ? dict["done.confirmedCallText"]
          : dict["done.confirmedText"]
        : dict["done.requestedText"];
      body = (
        <>
          <div className="done-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          {heading(title)}
          <p>{fill(text, { email: form.email })}</p>
          <dl className="kv">
            <dt>{dict["booking.ref"]}</dt>
            <dd>{result.ref}</dd>
            <dt>{dict["booking.when"]}</dt>
            <dd>{formatDateTime(dict, lang, result.date, result.time)}</dd>
            <dt>{dict["booking.kind"]}</dt>
            <dd>{tx(type?.name)}</dd>
            {result.meetingUrl && (
              <>
                <dt>{dict["booking.videoLink"]}</dt>
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
              {dict["booking.addToCalendar"]}
            </a>
            <Link href={manage} className="btn btn-ghost">
              {dict["booking.manage"]}
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
          <ol className="steps" aria-label={dict["wizard.progress"]}>
            {labels.map((l, i) => (
              <li key={l} data-state={stepState(i)} aria-current={i === step ? "step" : undefined}>
                <span>{l}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="panel">{body}</div>
      </div>

      <aside className="summary" aria-label={dict["wizard.summary"]}>
        <h2>{dict["wizard.summary"]}</h2>
        <dl>
          <div>
            <dt>{dict["booking.service"]}</dt>
            <dd>{serviceObj ? tx(serviceObj.name) : service === "unsicher" ? dict["booking.unsure"] : "–"}</dd>
          </div>
          <div>
            <dt>{dict["booking.type"]}</dt>
            <dd>{type ? `${tx(type.name)} (${formatDuration(type.durationMinutes, lang, "short")})` : "–"}</dd>
          </div>
          {!calendly && (
            <div>
              <dt>{dict["booking.when"]}</dt>
              <dd>{date && time ? formatDateTime(dict, lang, date, time) : "–"}</dd>
            </div>
          )}
        </dl>
        <p className="help">
          {dict["wizard.byPhone"]} <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
          <br />
          {tx(c.openingHours)}
        </p>
      </aside>
    </div>
  );
}
