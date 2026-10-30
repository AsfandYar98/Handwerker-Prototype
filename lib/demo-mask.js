// Customer names and contacts in the open demo dashboard (demo mode).
// Masked on the way out of the admin API, so the raw values never reach the open view;
// stored bookings, emails and the customer's .ics keep the real data.
import { isOpenDemoAdmin } from "./auth.js";
import { isPhoneQuestion } from "./calendly.js";

export const STREET_HIDDEN = "Straße ausgeblendet";

/** Jana Beispiel → Jana B. (first word + initial of the last; a single word stays as is) */
export function maskName(name) {
  const words = String(name).trim().split(/\s+/);
  if (words.length < 2) return words[0];
  const [initial] = Array.from(words.at(-1));
  return `${words[0]} ${initial.toUpperCase()}.`;
}

/** jane@example.com → j…@example.com */
export function maskEmail(email) {
  const at = email.lastIndexOf("@");
  return at > 0 ? `${email[0]}…${email.slice(at)}` : "…";
}

/** 0151 2345 6893 → 015…893 (fully masked if that would show every digit) */
export function maskPhone(phone) {
  const digits = String(phone).replace(/\D/g, "");
  return digits.length > 6 ? `${digits.slice(0, 3)}…${digits.slice(-3)}` : "…";
}

/** A booking as the admin API returns it: masked in the open demo view, unchanged otherwise. */
export function adminBooking(b) {
  if (!isOpenDemoAdmin()) return b;
  const c = b.customer || {};
  const answers = b.details?.answers;
  return {
    ...b,
    customer: {
      ...c,
      ...(c.name && { name: maskName(c.name) }),
      ...(c.email && { email: maskEmail(c.email) }),
      ...(c.phone && { phone: maskPhone(c.phone) }),
      ...(c.street && { street: STREET_HIDDEN }),
    },
    ...(answers?.length && {
      details: { ...b.details, answers: answers.map((a) => (isPhoneQuestion(a.question) && a.answer ? { ...a, answer: maskPhone(a.answer) } : a)) },
    }),
  };
}
