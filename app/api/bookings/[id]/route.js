import { getBooking } from "@/lib/store";
import { cancelByCustomer, publicBooking } from "@/lib/bookings";
import { isValidBookingToken } from "@/lib/auth";
import { errorResponse, json } from "@/lib/admin-session";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

async function authorize(request, params) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("t");
  if (!isValidBookingToken(id, token)) return { id, ok: false };
  return { id, ok: true };
}

export async function GET(request, { params }) {
  const { id, ok } = await authorize(request, params);
  if (!ok) return json({ error: "Link ungültig." }, 403);
  const booking = await getBooking(id);
  if (!booking) return json({ error: "Buchung nicht gefunden." }, 404);
  return json({ booking: publicBooking(booking) });
}

// DELETE /api/bookings/:id?t=token&lang=en — customer cancels; errors in `lang`.
export async function DELETE(request, { params }) {
  const lang = new URL(request.url).searchParams.get("lang");
  const { id, ok } = await authorize(request, params);
  if (!ok) return json({ error: getDict(lang)["error.invalidLink"] }, 403);
  try {
    const booking = await cancelByCustomer(id, lang);
    return json({ booking: publicBooking(booking) });
  } catch (err) {
    return errorResponse(err);
  }
}
