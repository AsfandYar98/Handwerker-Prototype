// Email via Resend's HTTP API (no SDK needed). Without RESEND_API_KEY, emails
// are skipped and logged, and the app keeps working.
import { siteConfig, getBookingType, getService } from "../site.config.js";
import { formatDateLong } from "./time.js";
import { bookingIcs } from "./ics.js";
import { bookingToken } from "./auth.js";

export const mailConfigured = Boolean(process.env.RESEND_API_KEY);

/** Company-side notifications. In demo mode this is ONLY NOTIFY_EMAIL, never the real company address. */
export function companyRecipients() {
  if (process.env.NOTIFY_EMAIL) return process.env.NOTIFY_EMAIL.split(",").map((s) => s.trim()).filter(Boolean);
  return siteConfig.demo.enabled ? [] : [siteConfig.company.email];
}

export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

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

function layout(title, rows, footer = "") {
  const t = siteConfig.theme;
  const c = siteConfig.company;
  return `<!doctype html><html><body style="margin:0;background:${t.tile};font-family:Arial,Helvetica,sans-serif;color:${t.ink}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid ${t.grout}">
    <tr><td style="background:${t.primary};color:#fff;padding:18px 24px;font-size:16px;font-weight:bold">${esc(c.brand)}</td></tr>
    <tr><td style="padding:24px">
      <h1 style="margin:0 0 16px;font-size:22px;color:${t.primary}">${esc(title)}</h1>
      ${rows}
      ${footer}
    </td></tr>
    <tr><td style="padding:16px 24px;border-top:1px solid ${t.grout};font-size:12px;color:#5b6b70">
      ${esc(c.legalName)} · ${esc(c.address.street)}, ${esc(c.address.zip)} ${esc(c.address.city)} · ${esc(c.phone)}
    </td></tr>
  </table></td></tr></table></body></html>`;
}

function detailTable(booking) {
  const type = getBookingType(booking.type);
  const service = getService(booking.service);
  const cust = booking.customer || {};
  const rows = [
    ["Termin", type?.name],
    ["Datum", formatDateLong(booking.date, siteConfig.locale)],
    ["Uhrzeit", `${booking.time} Uhr (${booking.durationMinutes} Min.)`],
    ["Leistung", service?.name || "Noch offen"],
    booking.meetingUrl ? ["Video-Link", `<a href="${esc(booking.meetingUrl)}">${esc(booking.meetingUrl)}</a>`] : null,
    cust.street ? ["Adresse", `${esc(cust.street)}, ${esc(cust.zip)} ${esc(cust.city)}`] : null,
    ["Buchungsnummer", booking.ref],
  ].filter(Boolean);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5b6b70;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${
          k === "Video-Link" || k === "Adresse" ? v : esc(v)
        }</td></tr>`
    )
    .join("")}</table>`;
}

function button(href, label) {
  const t = siteConfig.theme;
  return `<p style="margin:20px 0 0"><a href="${esc(href)}" style="display:inline-block;background:${t.primary};color:#fff;text-decoration:none;padding:12px 18px;font-weight:bold">${esc(label)}</a></p>`;
}

function icsAttachment(booking, cancelled = false) {
  return [
    {
      filename: cancelled ? "termin-abgesagt.ics" : "termin.ics",
      content: Buffer.from(bookingIcs(booking, { cancelled })).toString("base64"),
    },
  ];
}

function manageUrl(booking) {
  return `${siteUrl()}/buchung/${booking.id}?t=${bookingToken(booking.id)}`;
}

/** Customer: request received (on-site visits awaiting confirmation). */
export async function mailCustomerRequested(booking) {
  const html = layout(
    "Ihre Anfrage ist eingegangen",
    `<p style="font-size:15px;line-height:1.5">Guten Tag ${esc(booking.customer.name)},<br>vielen Dank für Ihre Anfrage. Wir prüfen den Termin und bestätigen ihn in der Regel innerhalb eines Werktags.</p>${detailTable(booking)}`,
    button(manageUrl(booking), "Buchung ansehen")
  );
  return sendMail({ to: booking.customer.email, subject: `Anfrage erhalten: ${booking.ref}`, html, replyTo: siteConfig.company.email });
}

/** Customer: confirmed (includes meeting link for calls and an .ics file). */
export async function mailCustomerConfirmed(booking) {
  const isCall = Boolean(booking.meetingUrl);
  const intro = isCall
    ? "Ihre Video-Beratung ist gebucht. Zum vereinbarten Zeitpunkt öffnen Sie einfach den Link unten – im Browser, ohne Installation."
    : "Ihr Termin ist bestätigt. Wir kommen pünktlich zu Ihnen.";
  const html = layout(
    isCall ? "Ihre Video-Beratung ist gebucht" : "Ihr Termin ist bestätigt",
    `<p style="font-size:15px;line-height:1.5">Guten Tag ${esc(booking.customer.name)},<br>${intro}</p>${detailTable(booking)}`,
    (isCall ? button(booking.meetingUrl, "Zum Video-Gespräch") : "") + button(manageUrl(booking), "Buchung verwalten")
  );
  return sendMail({
    to: booking.customer.email,
    subject: `${isCall ? "Video-Beratung" : "Termin"} bestätigt: ${formatDateLong(booking.date, siteConfig.locale)}, ${booking.time} Uhr`,
    html,
    attachments: icsAttachment(booking),
    replyTo: siteConfig.company.email,
  });
}

export async function mailCustomerCancelled(booking) {
  const html = layout(
    "Ihr Termin wurde abgesagt",
    `<p style="font-size:15px;line-height:1.5">Guten Tag ${esc(booking.customer.name)},<br>der folgende Termin findet nicht statt. Sie können jederzeit einen neuen Termin buchen.</p>${detailTable(booking)}`,
    button(`${siteUrl()}/termin`, "Neuen Termin buchen")
  );
  return sendMail({
    to: booking.customer.email,
    subject: `Termin abgesagt: ${booking.ref}`,
    html,
    attachments: icsAttachment(booking, true),
    replyTo: siteConfig.company.email,
  });
}

/** Company: new booking (with the same meeting link the customer got). */
export async function mailCompanyNew(booking) {
  const cust = booking.customer || {};
  const d = booking.details || {};
  const html = layout(
    booking.status === "confirmed" ? "Neuer Termin gebucht" : "Neue Terminanfrage",
    `${detailTable(booking)}
     <h2 style="font-size:16px;margin:20px 0 8px">Kunde</h2>
     <p style="font-size:14px;line-height:1.6;margin:0">${esc(cust.name)}<br>${esc(cust.email)}<br>${esc(cust.phone)}</p>
     ${d.bathroomSize || d.timeframe || d.message ? `<h2 style="font-size:16px;margin:20px 0 8px">Angaben</h2><p style="font-size:14px;line-height:1.6;margin:0">${d.bathroomSize ? `Badgröße: ${esc(d.bathroomSize)}<br>` : ""}${d.timeframe ? `Zeitraum: ${esc(d.timeframe)}<br>` : ""}${esc(d.message)}</p>` : ""}`,
    (booking.meetingUrl ? button(booking.meetingUrl, "Zum Video-Gespräch") : "") + button(`${siteUrl()}/admin`, "Im Dashboard öffnen")
  );
  return sendMail({
    to: companyRecipients(),
    subject: `${booking.status === "confirmed" ? "Gebucht" : "Anfrage"}: ${getBookingType(booking.type)?.name} am ${booking.date} um ${booking.time} – ${cust.name}`,
    html,
    attachments: booking.status === "confirmed" ? icsAttachment(booking) : undefined,
    replyTo: cust.email,
  });
}
