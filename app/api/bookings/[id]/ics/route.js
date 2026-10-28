import { getBooking } from "@/lib/store";
import { isValidBookingToken } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-session";
import { bookingIcs } from "@/lib/ics";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

// GET /api/bookings/:id/ics?t=token — "add to calendar" file (customer or admin).
export async function GET(request, { params }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("t");
  if (!isValidBookingToken(id, token) && !(await isAdmin())) {
    return new Response("Link ungültig.", { status: 403 });
  }
  const booking = await getBooking(id);
  if (!booking) return new Response("Nicht gefunden.", { status: 404 });
  return new Response(bookingIcs(booking, { cancelled: booking.status === "cancelled" }), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${getDict(booking.lang)["ics.file"]}-${booking.ref}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
