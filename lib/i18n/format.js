// Customer-facing formatting. Locale comes from the language, the timezone is
// always the company's (siteConfig.timezone), never the visitor's.
import { siteConfig } from "../../site.config.js";
import { formatDateLong, formatTime } from "../time.js";
import { localeFor } from "./config.js";

/** Fill {placeholders} in a dictionary string; unknown ones are left as-is. */
export function fill(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

export function formatDate(dateStr, lang) {
  return formatDateLong(dateStr, localeFor(lang));
}

/** "10:00 Uhr" / "10:00" / "godz. 10:00" */
export function formatClock(dict, lang, dateStr, time) {
  return fill(dict["format.time"], { time: formatTime(dateStr, time, localeFor(lang), siteConfig.timezone) });
}

/** "Dienstag, 3. November 2026, 10:00 Uhr" / "Tuesday 3 November 2026 at 10:00" / … */
export function formatDateTime(dict, lang, dateStr, time) {
  return fill(dict["format.dateTime"], {
    date: formatDate(dateStr, lang),
    time: formatTime(dateStr, time, localeFor(lang), siteConfig.timezone),
  });
}

const durationFormats = new Map();

/** "30 Minuten" / "30 minutes" / "30 minut" (long), "60 Min." / "60 mins" / "60 min" (short). Plurals come from Intl. */
export function formatDuration(minutes, lang, unitDisplay = "long") {
  const key = `${lang}|${unitDisplay}`;
  let f = durationFormats.get(key);
  if (!f) {
    f = new Intl.NumberFormat(localeFor(lang), { style: "unit", unit: "minute", unitDisplay });
    durationFormats.set(key, f);
  }
  return f.format(minutes);
}
