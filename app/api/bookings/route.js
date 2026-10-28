import { createWebsiteBooking, publicBooking } from "@/lib/bookings";
import { errorResponse, json } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

// POST /api/bookings — create a booking from the website form. The body carries
// `lang` (de/en/pl): stored on the booking, used for error messages and customer emails.
export async function POST(request) {
  try {
    const input = await request.json().catch(() => ({}));
    const { booking, token } = await createWebsiteBooking(input);
    return json({ booking: publicBooking(booking), token }, 201);
  } catch (err) {
    return errorResponse(err);
  }
}
