// Timezone helpers. Dates are stored as local "YYYY-MM-DD" + "HH:MM" strings in
// the company's timezone, so the server's own timezone (UTC on Vercel) never matters.

export function toMin(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
}

export function fromMin(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** 0 = Sunday … 6 = Saturday */
export function weekday(dateStr) {
  return new Date(`${dateStr}T12:00:00Z`).getUTCDay();
}

export function isValidDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr))) return false;
  const d = new Date(`${dateStr}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === dateStr;
}

export function isValidTime(t) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t));
}

function partsIn(ts, tz) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ts));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/** Current local date + minutes since midnight in `tz`. */
export function nowIn(tz, ts = Date.now()) {
  const p = partsIn(ts, tz);
  const date = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  return { date, minutes: p.hour * 60 + p.minute };
}

/** ISO timestamp → local { date, time } in tz. */
export function isoToLocal(iso, tz) {
  const ts = new Date(iso).getTime();
  const n = nowIn(tz, ts);
  return { date: n.date, time: fromMin(n.minutes) };
}

function offsetMs(ts, tz) {
  const p = partsIn(ts, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(ts / 1000) * 1000;
}

/** Local date + time in tz → Date (UTC instant). Handles DST. */
export function localToDate(dateStr, time, tz) {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let ts = guess - offsetMs(guess, tz);
  ts = guess - offsetMs(ts, tz);
  return new Date(ts);
}

export function formatDateLong(dateStr, locale = "de-DE") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateStr}T12:00:00Z`));
}

export function formatDateShort(dateStr, locale = "de-DE") {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${dateStr}T12:00:00Z`));
}

export function dayParts(dateStr, locale = "de-DE") {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const fmt = (opts) => new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(d);
  return { weekday: fmt({ weekday: "short" }), day: fmt({ day: "numeric" }), month: fmt({ month: "short" }) };
}
