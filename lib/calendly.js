// Calendly helpers.
// Calendly itself emails the confirmation + meeting link (Zoom / Google Meet / Teams,
// whatever the event type's location is) to BOTH the invitee and the host.
// This module mirrors those bookings into our own store so they show up in the
// admin dashboard and block the same time for on-site visits.
import crypto from "node:crypto";
import { siteConfig } from "../site.config.js";
import { isoToLocal } from "./time.js";

const API = "https://api.calendly.com/";

export const calendlyTokenConfigured = Boolean(process.env.CALENDLY_TOKEN);
export const calendlyWebhookConfigured = Boolean(process.env.CALENDLY_WEBHOOK_SIGNING_KEY);

export function isCalendlyApiUri(uri) {
  return typeof uri === "string" && uri.startsWith(API) && !uri.includes("..");
}

/** Custom question that asks for the phone number ("Telefon" in the README setup). */
export function isPhoneQuestion(question) {
  return /telefon|phone/i.test(question || "");
}

async function get(uri) {
  if (!calendlyTokenConfigured || !isCalendlyApiUri(uri)) return null;
  const res = await fetch(uri, {
    headers: { Authorization: `Bearer ${process.env.CALENDLY_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.resource || null;
}

/** Fetch invitee + event details from Calendly (needs CALENDLY_TOKEN). */
export async function fetchCalendlyBooking(eventUri, inviteeUri) {
  const [event, invitee] = await Promise.all([get(eventUri), get(inviteeUri)]);
  if (!event && !invitee) return null;
  return normalize({ event, invitee });
}

/** Normalise Calendly data (API or webhook payload) into our fields. */
export function normalize({ event, invitee }) {
  const start = event?.start_time;
  const end = event?.end_time;
  const local = start ? isoToLocal(start, siteConfig.timezone) : null;
  const duration = start && end ? Math.round((new Date(end) - new Date(start)) / 60000) : null;
  const loc = event?.location || {};
  return {
    date: local?.date || null,
    time: local?.time || null,
    durationMinutes: duration,
    meetingUrl: loc.join_url || (typeof loc.location === "string" && loc.location.startsWith("http") ? loc.location : null),
    status: invitee?.status === "canceled" || event?.status === "canceled" ? "cancelled" : "confirmed",
    customer: invitee ? { name: invitee.name, email: invitee.email } : null,
    answers: invitee?.questions_and_answers || [],
    calendly: {
      eventUri: event?.uri || invitee?.event || null,
      inviteeUri: invitee?.uri || null,
      cancelUrl: invitee?.cancel_url || null,
      rescheduleUrl: invitee?.reschedule_url || null,
      eventName: event?.name || null,
    },
  };
}

/**
 * Verify the Calendly-Webhook-Signature header: "t=<unix>,v1=<hex hmac>".
 * HMAC-SHA256 over `${t}.${rawBody}` with the subscription's signing key.
 */
export function verifyCalendlySignature(rawBody, header, key = process.env.CALENDLY_WEBHOOK_SIGNING_KEY, toleranceSec = 180) {
  if (!key || !header) return false;
  const parts = Object.fromEntries(
    String(header)
      .split(",")
      .map((p) => p.split("=").map((s) => s.trim()))
      .filter((p) => p.length === 2)
  );
  if (!parts.t || !parts.v1) return false;
  const age = Math.abs(Date.now() / 1000 - Number(parts.t));
  if (!Number.isFinite(age) || age > toleranceSec) return false;
  const expected = crypto.createHmac("sha256", key).update(`${parts.t}.${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
