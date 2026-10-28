import { getBookingType } from "@/site.config";
import { getBlockedDates, listBookings } from "@/lib/store";
import { daysOverview, slotsForDate } from "@/lib/slots";
import { isValidDate } from "@/lib/time";
import { json } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

// GET /api/slots?type=besichtigung&date=2026-11-03   → { slots: [{ time, available }] }
// GET /api/slots?type=besichtigung&days=21            → { days:  [{ date, open, free }] }
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const typeKey = searchParams.get("type");
  if (!getBookingType(typeKey)) return json({ error: "Unbekannte Terminart." }, 400);

  const [bookings, blocked] = await Promise.all([listBookings(), getBlockedDates()]);
  const date = searchParams.get("date");
  if (date) {
    if (!isValidDate(date)) return json({ error: "Ungültiges Datum." }, 400);
    return json({ date, slots: slotsForDate({ date, typeKey, bookings, blocked }) });
  }
  const days = Math.min(Math.max(Number(searchParams.get("days")) || 21, 1), 60);
  return json({ days: daysOverview({ days, typeKey, bookings, blocked }) });
}
