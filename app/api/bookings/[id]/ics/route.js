import { getBooking } from "@/lib/store";
import { isValidBookingToken } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-session";
import { adminBooking } from "@/lib/demo-mask";
import { bookingIcs } from "@/lib/ics";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

// GET /api/bookings/:id/ics?t=token — "add to calendar" file (customer or admin).
export async function GET(request, { params }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("t");
  const viaToken = isValidBookingToken(id, token);
  if (!viaToken && !(await isAdmin())) {
    return new Response("Link ungültig.", { status: 403 });
  }
  const stored = await getBooking(id);
  if (!stored) return new Response("Nicht gefunden.", { status: 404 });
  // The customer's own link gets the real address; the open demo dashboard gets it masked.
  const booking = viaToken ? stored : adminBooking(stored);
  return new Response(bookingIcs(booking, { cancelled: booking.status === "cancelled" }), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${getDict(booking.lang)["ics.file"]}-${booking.ref}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
