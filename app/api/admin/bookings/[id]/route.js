import { updateBookingByAdmin } from "@/lib/bookings";
import { errorResponse, isAdmin, json, unauthorized } from "@/lib/admin-session";
import { adminBooking } from "@/lib/demo-mask";

export const dynamic = "force-dynamic";

// PATCH /api/admin/bookings/:id  { status?, notes? }
export async function PATCH(request, { params }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  try {
    const body = await request.json().catch(() => ({}));
    const booking = await updateBookingByAdmin(id, { status: body.status, notes: body.notes });
    return json({ booking: adminBooking(booking) });
  } catch (err) {
    return errorResponse(err);
  }
}
