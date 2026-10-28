import { siteConfig } from "@/site.config";
import { upsertCalendlyBooking } from "@/lib/bookings";
import { fetchCalendlyBooking, isCalendlyApiUri } from "@/lib/calendly";
import { errorResponse, json } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

// POST /api/calendly/booked — called by the booking page right after the
// Calendly widget fires "calendly.event_scheduled". Calendly has already sent
// the confirmation + meeting link to both parties; we mirror the booking here.
// With CALENDLY_TOKEN set, date/time/meeting link are read from Calendly's API.
export async function POST(request) {
  if (!siteConfig.calendly.url) return json({ error: "Calendly ist nicht eingerichtet." }, 400);
  try {
    const body = await request.json().catch(() => ({}));
    const { eventUri, inviteeUri } = body;
    if (!isCalendlyApiUri(eventUri) || !isCalendlyApiUri(inviteeUri)) {
      return json({ error: "Ungültige Calendly-Daten." }, 400);
    }
    const details = await fetchCalendlyBooking(eventUri, inviteeUri);
    const data = details || {
      status: "confirmed",
      calendly: { eventUri, inviteeUri },
      customer: null,
    };
    const booking = await upsertCalendlyBooking(data, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
      service: body.service,
      lang: body.lang,
    });
    return json({
      ok: true,
      ref: booking.ref,
      date: booking.date || null,
      time: booking.time || null,
      meetingUrl: booking.meetingUrl || null,
      detailsFetched: Boolean(details),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
