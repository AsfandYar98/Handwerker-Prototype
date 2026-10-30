import { listBookings } from "@/lib/store";
import { isAdmin, json, unauthorized } from "@/lib/admin-session";
import { adminBooking } from "@/lib/demo-mask";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  const bookings = await listBookings();
  bookings.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  return json({ bookings: bookings.map(adminBooking) });
}
