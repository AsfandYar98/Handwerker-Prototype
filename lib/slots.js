import { siteConfig, getBookingType } from "../site.config.js";
import { addDays, fromMin, nowIn, toMin, weekday } from "./time.js";

const ACTIVE = (b) => b.status !== "cancelled";

function cutoff(now, leadHours) {
  const abs = now.minutes + leadHours * 60;
  return { date: addDays(now.date, Math.floor(abs / 1440)), minutes: abs % 1440 };
}

/**
 * All slots for one date and booking type, each flagged available or not.
 * `bookings` = every stored booking (any type); overlapping ones block a slot,
 * including Calendly calls, so the company is never double-booked.
 */
export function slotsForDate({ date, typeKey, bookings = [], blocked = [], now, config = siteConfig }) {
  const type = config.bookingTypes.find((t) => t.key === typeKey) || getBookingType(typeKey);
  if (!type) return [];
  const av = config.availability;
  const current = now || nowIn(config.timezone);

  if (blocked.includes(date)) return [];
  if (date > addDays(current.date, av.horizonDays)) return [];
  const hours = av.weeklyHours[weekday(date)];
  if (!hours) return [];

  const cut = cutoff(current, av.leadTimeHours);
  if (date < cut.date) return [];

  const [open, close] = hours.map(toMin);
  const dur = type.durationMinutes;
  const buf = av.bufferMinutes;
  const sameDay = bookings.filter((b) => ACTIVE(b) && b.date === date && b.time);

  const slots = [];
  for (let t = open; t + dur <= close; t += av.slotStepMinutes) {
    if (date === cut.date && t < cut.minutes) continue;
    const clash = sameDay.some((b) => {
      const bs = toMin(b.time);
      const be = bs + (b.durationMinutes || 60);
      return t < be + buf && bs < t + dur + buf;
    });
    slots.push({ time: fromMin(t), available: !clash });
  }
  return slots;
}

export function isSlotAvailable(args) {
  return slotsForDate(args).some((s) => s.time === args.time && s.available);
}

/** Overview for the day picker: [{ date, free }] for the next `days` days. */
export function daysOverview({ from, days = 21, typeKey, bookings = [], blocked = [], now, config = siteConfig }) {
  const current = now || nowIn(config.timezone);
  const start = from || current.date;
  const out = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(start, i);
    const slots = slotsForDate({ date, typeKey, bookings, blocked, now: current, config });
    const open = Boolean(config.availability.weeklyHours[weekday(date)]) && !blocked.includes(date);
    out.push({ date, open, free: slots.filter((s) => s.available).length });
  }
  return out;
}
