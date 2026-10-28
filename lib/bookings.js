// Booking business logic, shared by the API routes.
import { siteConfig, getBookingType, getService, usesCalendly } from "../site.config.js";
import { getBlockedDates, getBooking, listBookings, saveBooking } from "./store.js";
import { isSlotAvailable } from "./slots.js";
import { isValidDate, isValidTime, nowIn, toMin } from "./time.js";
import { bookingToken, newId, newRef, randomSlug } from "./auth.js";
import { mailCompanyNew, mailCustomerCancelled, mailCustomerConfirmed, mailCustomerRequested } from "./mail.js";

export const STATUS = {
  requested: "Angefragt",
  confirmed: "Bestätigt",
  done: "Erledigt",
  cancelled: "Abgesagt",
};

const str = (v, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class BookingError extends Error {
  constructor(message, status = 400, field) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

function refPrefix() {
  const words = siteConfig.company.brand.split(/\s+/).filter(Boolean);
  return (words.length > 1 ? words.map((w) => w[0]).join("") : siteConfig.company.brand.slice(0, 2)).toUpperCase().slice(0, 3);
}

export function meetingLinkFor(ref) {
  return `${siteConfig.meeting.baseUrl}/${siteConfig.slug}-${ref}-${randomSlug(8)}`;
}

/** Validate input from the booking form and create the booking. */
export async function createWebsiteBooking(input) {
  const type = getBookingType(input.type);
  if (!type) throw new BookingError("Bitte wählen Sie eine Terminart.", 400, "type");
  if (usesCalendly(type)) throw new BookingError("Diese Terminart wird über Calendly gebucht.", 400, "type");

  const service = input.service && input.service !== "unsicher" ? getService(input.service) : null;
  if (input.service && input.service !== "unsicher" && !service) throw new BookingError("Unbekannte Leistung.", 400, "service");

  if (!isValidDate(input.date) || !isValidTime(input.time)) throw new BookingError("Bitte wählen Sie Datum und Uhrzeit.", 400, "date");

  const customer = {
    name: str(input.name, 120),
    email: str(input.email, 200).toLowerCase(),
    phone: str(input.phone, 60),
    street: str(input.street, 160),
    zip: str(input.zip, 10),
    city: str(input.city, 80),
  };
  if (customer.name.length < 2) throw new BookingError("Bitte geben Sie Ihren Namen an.", 400, "name");
  if (!EMAIL_RE.test(customer.email)) throw new BookingError("Bitte geben Sie eine gültige E-Mail-Adresse an.", 400, "email");
  if (customer.phone.replace(/\D/g, "").length < 6) throw new BookingError("Bitte geben Sie eine Telefonnummer an.", 400, "phone");
  if (type.mode === "onsite") {
    if (!customer.street) throw new BookingError("Bitte geben Sie Straße und Hausnummer an.", 400, "street");
    if (!/^\d{5}$/.test(customer.zip)) throw new BookingError("Bitte geben Sie eine fünfstellige PLZ an.", 400, "zip");
    if (!customer.city) throw new BookingError("Bitte geben Sie den Ort an.", 400, "city");
  } else {
    delete customer.street;
    delete customer.zip;
    delete customer.city;
  }
  if (!input.consent) throw new BookingError("Bitte stimmen Sie der Datenverarbeitung zu.", 400, "consent");
  if (str(input.website)) throw new BookingError("Anfrage konnte nicht gesendet werden.", 400); // honeypot

  const [bookings, blocked] = await Promise.all([listBookings(), getBlockedDates()]);
  if (!isSlotAvailable({ date: input.date, time: input.time, typeKey: type.key, bookings, blocked })) {
    throw new BookingError("Dieser Termin ist leider gerade vergeben worden. Bitte wählen Sie eine andere Uhrzeit.", 409, "time");
  }

  const now = new Date().toISOString();
  const ref = newRef(refPrefix());
  const booking = {
    id: newId(),
    ref,
    createdAt: now,
    source: "website",
    type: type.key,
    service: service ? service.slug : null,
    date: input.date,
    time: input.time,
    durationMinutes: type.durationMinutes,
    status: type.autoConfirm ? "confirmed" : "requested",
    meetingUrl: type.mode === "call" ? meetingLinkFor(ref) : null,
    customer,
    details: {
      bathroomSize: str(input.bathroomSize, 40),
      timeframe: str(input.timeframe, 60),
      message: str(input.message, 2000),
    },
    notes: "",
    history: [
      {
        at: now,
        action:
          type.mode === "call"
            ? "Gebucht über Website – Video-Link an Kunde und Betrieb versendet"
            : "Angefragt über Website",
      },
    ],
  };
  await saveBooking(booking);

  // Both parties get notified. For calls, both emails contain the same meeting link.
  await Promise.all([
    booking.status === "confirmed" ? mailCustomerConfirmed(booking) : mailCustomerRequested(booking),
    mailCompanyNew(booking),
  ]);

  return { booking, token: bookingToken(booking.id) };
}

/** Admin status change (+ customer email). */
export async function updateBookingByAdmin(id, { status, notes }) {
  const booking = await getBooking(id);
  if (!booking) throw new BookingError("Buchung nicht gefunden.", 404);
  const now = new Date().toISOString();
  const prev = booking.status;

  if (typeof notes === "string") {
    booking.notes = notes.slice(0, 4000);
  }
  if (status && status !== prev) {
    if (!STATUS[status]) throw new BookingError("Unbekannter Status.", 400);
    if (booking.source === "calendly" && status === "cancelled") {
      throw new BookingError("Calendly-Termine bitte direkt in Calendly absagen – der Status wird dann automatisch übernommen.", 400);
    }
    booking.status = status;
    booking.history = [...(booking.history || []), { at: now, action: `Status: ${STATUS[status]}` }];
  }
  await saveBooking(booking);

  if (status && status !== prev && booking.source === "website") {
    if (status === "confirmed") await mailCustomerConfirmed(booking);
    if (status === "cancelled") await mailCustomerCancelled(booking);
  }
  return booking;
}

/** Customer cancels via their manage link. */
export async function cancelByCustomer(id) {
  const booking = await getBooking(id);
  if (!booking) throw new BookingError("Buchung nicht gefunden.", 404);
  if (booking.source !== "website") throw new BookingError("Bitte sagen Sie diesen Termin über den Link in Ihrer Calendly-E-Mail ab.", 400);
  if (booking.status === "cancelled") return booking;
  if (isPast(booking)) throw new BookingError("Vergangene Termine können nicht mehr abgesagt werden.", 400);
  booking.status = "cancelled";
  booking.history = [...(booking.history || []), { at: new Date().toISOString(), action: "Vom Kunden abgesagt" }];
  await saveBooking(booking);
  await mailCustomerCancelled(booking);
  return booking;
}

export function isPast(booking) {
  if (!booking.date) return false;
  const now = nowIn(siteConfig.timezone);
  if (booking.date !== now.date) return booking.date < now.date;
  return toMin(booking.time || "00:00") < now.minutes;
}

/** Upsert a Calendly booking (from the widget callback or the webhook). */
export async function upsertCalendlyBooking(data, extra = {}) {
  const inviteeUri = data.calendly?.inviteeUri;
  const all = await listBookings();
  const existing = inviteeUri ? all.find((b) => b.calendly?.inviteeUri === inviteeUri) : null;
  const now = new Date().toISOString();
  const callType = siteConfig.bookingTypes.find((t) => t.mode === "call");

  if (existing) {
    const merged = {
      ...existing,
      date: data.date || existing.date,
      time: data.time || existing.time,
      durationMinutes: data.durationMinutes || existing.durationMinutes,
      meetingUrl: data.meetingUrl || existing.meetingUrl,
      status: data.status || existing.status,
      customer: { ...existing.customer, ...(data.customer || {}) },
      calendly: { ...existing.calendly, ...Object.fromEntries(Object.entries(data.calendly || {}).filter(([, v]) => v)) },
    };
    if (merged.status !== existing.status) {
      merged.history = [...(existing.history || []), { at: now, action: merged.status === "cancelled" ? "In Calendly abgesagt" : `Status: ${STATUS[merged.status]}` }];
    }
    await saveBooking(merged);
    return merged;
  }

  const ref = newRef(refPrefix());
  const booking = {
    id: newId(),
    ref,
    createdAt: now,
    source: "calendly",
    type: callType ? callType.key : "beratung",
    service: extra.service && getService(extra.service) ? extra.service : null,
    date: data.date,
    time: data.time,
    durationMinutes: data.durationMinutes || callType?.durationMinutes || 30,
    status: data.status || "confirmed",
    meetingUrl: data.meetingUrl || null,
    customer: {
      name: data.customer?.name || str(extra.name, 120),
      email: data.customer?.email || str(extra.email, 200),
      phone: str(extra.phone, 60),
    },
    details: { message: str(extra.message, 2000), answers: data.answers || [] },
    calendly: data.calendly || {},
    notes: "",
    history: [{ at: now, action: "Über Calendly gebucht – Calendly hat Bestätigung und Meeting-Link an beide Seiten gesendet" }],
  };
  await saveBooking(booking);
  return booking;
}

/** Public view of a booking (customer page). */
export function publicBooking(b) {
  return {
    id: b.id,
    ref: b.ref,
    type: b.type,
    service: b.service,
    date: b.date,
    time: b.time,
    durationMinutes: b.durationMinutes,
    status: b.status,
    meetingUrl: b.status === "cancelled" ? null : b.meetingUrl,
    source: b.source,
    calendly: b.source === "calendly" ? { cancelUrl: b.calendly?.cancelUrl, rescheduleUrl: b.calendly?.rescheduleUrl } : undefined,
    customer: { name: b.customer?.name, street: b.customer?.street, zip: b.customer?.zip, city: b.customer?.city },
  };
}
