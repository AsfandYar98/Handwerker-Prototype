import { upsertCalendlyBooking } from "@/lib/bookings";
import { isPhoneQuestion, normalize, verifyCalendlySignature } from "@/lib/calendly";
import { json } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

// Calendly webhook (invitee.created / invitee.canceled).
// Register it once with:  npm run calendly:webhook -- https://<your-domain>/api/webhooks/calendly
// Requires CALENDLY_WEBHOOK_SIGNING_KEY (webhooks need a paid Calendly plan).
export async function POST(request) {
  const raw = await request.text();
  if (!verifyCalendlySignature(raw, request.headers.get("calendly-webhook-signature"))) {
    return json({ error: "Invalid signature" }, 401);
  }
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const p = body.payload || {};
  if (body.event !== "invitee.created" && body.event !== "invitee.canceled") {
    return json({ ignored: body.event });
  }
  const data = normalize({
    event: p.scheduled_event ? { ...p.scheduled_event, uri: p.scheduled_event.uri || p.event } : null,
    invitee: { ...p, status: body.event === "invitee.canceled" ? "canceled" : p.status, event: p.event },
  });
  const phone = (p.questions_and_answers || []).find((q) => isPhoneQuestion(q.question))?.answer;
  const booking = await upsertCalendlyBooking(data, { phone });
  return json({ ok: true, id: booking.id });
}
