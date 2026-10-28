import { siteConfig, getBookingType } from "../site.config.js";
import { addDays, fromMin, toMin } from "./time.js";
import { getDict, langOrDefault } from "./i18n/index.js";
import { fill } from "./i18n/format.js";
import { t } from "./i18n/t.js";

const esc = (s) =>
  String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

const compact = (date, time) => `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;

// Minimal VTIMEZONE for Europe/Berlin (CET/CEST) so calendar apps place it correctly.
const VTZ_BERLIN = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Berlin",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

/** Calendar file for a booking. Texts are in `lang` (default: the booking's language). */
export function bookingIcs(booking, { cancelled = false, lang = langOrDefault(booking.lang) } = {}) {
  const tz = siteConfig.timezone;
  const d = getDict(lang);
  const type = getBookingType(booking.type);
  const title = `${type ? t(type.name, lang) : d["booking.fallbackType"]} – ${siteConfig.company.brand}`;
  const startMin = toMin(booking.time);
  const endAbs = startMin + (booking.durationMinutes || 60);
  const endDate = endAbs >= 1440 ? addDays(booking.date, 1) : booking.date;
  const end = fromMin(endAbs % 1440);
  const c = siteConfig.company;
  const location =
    booking.meetingUrl ||
    [booking.customer?.street, [booking.customer?.zip, booking.customer?.city].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ");

  const description = [
    title,
    booking.meetingUrl ? `${d["booking.videoLink"]}: ${booking.meetingUrl}` : "",
    `${d["booking.ref"]}: ${booking.ref}`,
    fill(d["ics.questions"], { phone: c.phone, email: c.email }),
  ]
    .filter(Boolean)
    .join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${siteConfig.slug}//booking//${lang.toUpperCase()}`,
    "CALSCALE:GREGORIAN",
    `METHOD:${cancelled ? "CANCEL" : "PUBLISH"}`,
    ...(tz === "Europe/Berlin" ? VTZ_BERLIN : []),
    "BEGIN:VEVENT",
    `UID:${booking.id}@${siteConfig.slug}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=${tz}:${compact(booking.date, booking.time)}`,
    `DTEND;TZID=${tz}:${compact(endDate, end)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    location ? `LOCATION:${esc(location)}` : "",
    booking.meetingUrl ? `URL:${booking.meetingUrl}` : "",
    `STATUS:${cancelled ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n") + "\r\n";
}
