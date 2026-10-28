// Email via Resend's HTTP API (no SDK needed). Without RESEND_API_KEY, emails
// are skipped and logged, and the app keeps working.
import { siteConfig, getBookingType, getService } from "../site.config.js";
import { bookingIcs } from "./ics.js";
import { bookingToken } from "./auth.js";
import { siteUrl } from "./site-url.js";
import { DEFAULT_LANG, getDict, langOrDefault } from "./i18n/index.js";
import { fill, formatClock, formatDate, formatDateTime, formatDuration } from "./i18n/format.js";
import { withLang } from "./i18n/href.js";
import { t } from "./i18n/t.js";

export const mailConfigured = Boolean(process.env.RESEND_API_KEY);

/** Company-side notifications. In demo mode this is ONLY NOTIFY_EMAIL, never the real company address. */
export function companyRecipients() {
  if (process.env.NOTIFY_EMAIL) return process.env.NOTIFY_EMAIL.split(",").map((s) => s.trim()).filter(Boolean);
  return siteConfig.demo.enabled ? [] : [siteConfig.company.email];
}

export { siteUrl };

export async function sendMail({ to, subject, html, text, attachments, replyTo }) {
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!mailConfigured || recipients.length === 0) {
    console.log(`[mail skipped] ${subject} → ${recipients.join(", ") || "(no recipient)"}`);
    return { skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || `${siteConfig.company.brand} <onboarding@resend.dev>`,
        to: recipients,
        subject,
        html,
        text,
        reply_to: replyTo || undefined,
        attachments,
      }),
    });
    if (!res.ok) {
      console.error("[mail failed]", res.status, await res.text().catch(() => ""));
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[mail failed]", err);
    return { ok: false };
  }
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

// Customer emails are in the booking's language; company emails stay German.

function layout(lang, title, rows, footer = "") {
  const theme = siteConfig.theme;
  const c = siteConfig.company;
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:${theme.tile};font-family:Arial,Helvetica,sans-serif;color:${theme.ink}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid ${theme.grout}">
    <tr><td style="background:${theme.primary};color:#fff;padding:18px 24px;font-size:16px;font-weight:bold">${esc(c.brand)}</td></tr>
    <tr><td style="padding:24px">
      <h1 style="margin:0 0 16px;font-size:22px;color:${theme.primary}">${esc(title)}</h1>
      ${rows}
      ${footer}
    </td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid ${theme.grout};font-size:12px;color:#5b6b70">
      ${esc(c.legalName)} · ${esc(c.address.street)}, ${esc(c.address.zip)} ${esc(c.address.city)} · ${esc(c.phone)}
    </td></tr>
  </table></td></tr></table></body></html>`;
}

function detailTable(booking, lang) {
  const d = getDict(lang);
  const type = getBookingType(booking.type);
  const service = getService(booking.service);
  const cust = booking.customer || {};
  // Values are escaped here unless `html` is set (already escaped markup).
  const rows = [
    { label: d["booking.when"], value: t(type?.name, lang) },
    { label: d["booking.date"], value: formatDate(booking.date, lang) },
    {
      label: d["booking.time"],
      value: `${formatClock(d, lang, booking.date, booking.time)} (${formatDuration(booking.durationMinutes, lang, "short")})`,
    },
    { label: d["booking.service"], value: service ? t(service.name, lang) : d["booking.serviceOpen"] },
    booking.meetingUrl && {
      label: d["booking.videoLink"],
      html: `<a href="${esc(booking.meetingUrl)}">${esc(booking.meetingUrl)}</a>`,
    },
    cust.street && { label: d["booking.address"], value: `${cust.street}, ${cust.zip} ${cust.city}` },
    { label: d["booking.ref"], value: booking.ref },
  ].filter(Boolean);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse">${rows
    .map(
      (row) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5b6b70;white-space:nowrap;vertical-align:top">${esc(row.label)}</td><td style="padding:6px 0">${
          row.html ?? esc(row.value)
        }</td></tr>`
    )
    .join("")}</table>`;
}

function button(href, label) {
  const theme = siteConfig.theme;
  return `<p style="margin:20px 0 0"><a href="${esc(href)}" style="display:inline-block;background:${theme.primary};color:#fff;text-decoration:none;padding:12px 18px;font-weight:bold">${esc(label)}</a></p>`;
}

function greeting(d, booking, text) {
  return `<p style="font-size:15px;line-height:1.5">${esc(fill(d["mail.greeting"], { name: booking.customer.name }))}<br>${esc(text)}</p>`;
}

function icsAttachment(booking, lang, cancelled = false) {
  const d = getDict(lang);
  return [
    {
      filename: `${d[cancelled ? "ics.fileCancelled" : "ics.file"]}.ics`,
      content: Buffer.from(bookingIcs(booking, { cancelled, lang })).toString("base64"),
    },
  ];
}

function manageUrl(booking, lang) {
  return `${siteUrl()}${withLang(lang, `/buchung/${booking.id}`)}?t=${bookingToken(booking.id)}`;
}

/** Customer: request received (on-site visits awaiting confirmation). */
export async function mailCustomerRequested(booking) {
  const lang = langOrDefault(booking.lang);
  const d = getDict(lang);
  const html = layout(
    lang,
    d["done.requested"],
    greeting(d, booking, d["mail.requestedBody"]) + detailTable(booking, lang),
    button(manageUrl(booking, lang), d["mail.viewBooking"])
  );
  return sendMail({
    to: booking.customer.email,
    subject: fill(d["mail.requestedSubject"], { ref: booking.ref }),
    html,
    replyTo: siteConfig.company.email,
  });
}

/** Customer: confirmed (includes meeting link for calls and an .ics file). */
export async function mailCustomerConfirmed(booking) {
  const lang = langOrDefault(booking.lang);
  const d = getDict(lang);
  const isCall = Boolean(booking.meetingUrl);
  const html = layout(
    lang,
    isCall ? d["done.callBooked"] : d["mail.confirmedTitle"],
    greeting(d, booking, isCall ? d["mail.confirmedCallBody"] : d["mail.confirmedBody"]) + detailTable(booking, lang),
    (isCall ? button(booking.meetingUrl, d["booking.joinCall"]) : "") + button(manageUrl(booking, lang), d["booking.manage"])
  );
  return sendMail({
    to: booking.customer.email,
    subject: fill(d[isCall ? "mail.confirmedCallSubject" : "mail.confirmedSubject"], {
      when: formatDateTime(d, lang, booking.date, booking.time),
    }),
    html,
    attachments: icsAttachment(booking, lang),
    replyTo: siteConfig.company.email,
  });
}

export async function mailCustomerCancelled(booking) {
  const lang = langOrDefault(booking.lang);
  const d = getDict(lang);
  const html = layout(
    lang,
    d["mail.cancelledTitle"],
    greeting(d, booking, d["mail.cancelledBody"]) + detailTable(booking, lang),
    button(`${siteUrl()}${withLang(lang, "/termin")}`, d["cta.bookNew"])
  );
  return sendMail({
    to: booking.customer.email,
    subject: fill(d["mail.cancelledSubject"], { ref: booking.ref }),
    html,
    attachments: icsAttachment(booking, lang, true),
    replyTo: siteConfig.company.email,
  });
}

const languageNameDe = new Intl.DisplayNames("de", { type: "language" });

/** Company: new booking (with the same meeting link the customer got). Always German. */
export async function mailCompanyNew(booking) {
  const lang = DEFAULT_LANG;
  const cust = booking.customer || {};
  const d = booking.details || {};
  const customerLang = langOrDefault(booking.lang);
  const html = layout(
    lang,
    booking.status === "confirmed" ? "Neuer Termin gebucht" : "Neue Terminanfrage",
    `${detailTable(booking, lang)}
     <h2 style="font-size:16px;margin:20px 0 8px">Kunde</h2>
     <p style="font-size:14px;line-height:1.6;margin:0">${esc(cust.name)}<br>${esc(cust.email)}<br>${esc(cust.phone)}${customerLang !== lang ? `<br>Sprache: ${esc(languageNameDe.of(customerLang))}` : ""}</p>
     ${d.bathroomSize || d.timeframe || d.message ? `<h2 style="font-size:16px;margin:20px 0 8px">Angaben</h2><p style="font-size:14px;line-height:1.6;margin:0">${d.bathroomSize ? `Badgröße: ${esc(d.bathroomSize)}<br>` : ""}${d.timeframe ? `Zeitraum: ${esc(d.timeframe)}<br>` : ""}${esc(d.message)}</p>` : ""}`,
    (booking.meetingUrl ? button(booking.meetingUrl, "Zum Video-Gespräch") : "") + button(`${siteUrl()}/admin`, "Im Dashboard öffnen")
  );
  return sendMail({
    to: companyRecipients(),
    subject: `${booking.status === "confirmed" ? "Gebucht" : "Anfrage"}: ${t(getBookingType(booking.type)?.name, lang)} am ${booking.date} um ${booking.time} – ${cust.name}`,
    html,
    attachments: booking.status === "confirmed" ? icsAttachment(booking, lang) : undefined,
    replyTo: cust.email,
  });
}
