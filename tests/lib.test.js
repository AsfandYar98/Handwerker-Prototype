import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

process.env.NEXT_PUBLIC_DEMO_MODE = "true";

const { slotsForDate, daysOverview, isSlotAvailable } = await import("../lib/slots.js");
const { localToDate, isoToLocal, addDays, weekday, nowIn, isValidDate } = await import("../lib/time.js");
const { bookingIcs } = await import("../lib/ics.js");
const { verifyCalendlySignature, normalize, isCalendlyApiUri } = await import("../lib/calendly.js");
const { calendlyEmbedUrl } = await import("../lib/calendly-url.js");
const auth = await import("../lib/auth.js");
const bookings = await import("../lib/bookings.js");
const store = await import("../lib/store.js");

// A Monday far enough ahead to be outside lead time but inside the horizon.
function nextWeekday(target) {
  let d = addDays(nowIn("Europe/Berlin").date, 10); // clear of demo bookings
  while (weekday(d) !== target) d = addDays(d, 1);
  return d;
}

test("time: DST-aware local → UTC", () => {
  assert.equal(localToDate("2026-07-01", "10:00", "Europe/Berlin").toISOString(), "2026-07-01T08:00:00.000Z");
  assert.equal(localToDate("2026-12-01", "10:00", "Europe/Berlin").toISOString(), "2026-12-01T09:00:00.000Z");
  assert.deepEqual(isoToLocal("2026-10-25T09:30:00Z", "Europe/Berlin"), { date: "2026-10-25", time: "10:30" });
  assert.equal(isValidDate("2026-02-30"), false);
  assert.equal(isValidDate("2026-02-28"), true);
});

test("slots: weekly hours, duration, closed days", () => {
  const monday = nextWeekday(1);
  const slots = slotsForDate({ date: monday, typeKey: "besichtigung" });
  assert.equal(slots[0].time, "08:00");
  assert.equal(slots.at(-1).time, "17:00"); // 60 min must end by 18:00
  assert.ok(slots.every((s) => s.available));
  const friday = nextWeekday(5);
  assert.equal(slotsForDate({ date: friday, typeKey: "besichtigung" }).length, 0);
  const call = slotsForDate({ date: monday, typeKey: "beratung" });
  assert.equal(call.at(-1).time, "17:30");
});

test("slots: bookings block overlapping times incl. buffer, cancelled ones don't", () => {
  const monday = nextWeekday(1);
  const b = [{ date: monday, time: "10:00", durationMinutes: 60, status: "confirmed" }];
  const slots = slotsForDate({ date: monday, typeKey: "besichtigung", bookings: b });
  const free = (t) => slots.find((s) => s.time === t).available;
  assert.equal(free("08:30"), true); // 08:30–09:30 + 30 buffer ends exactly 10:00
  assert.equal(free("09:00"), false);
  assert.equal(free("10:30"), false);
  assert.equal(free("11:30"), true);
  const cancelled = [{ ...b[0], status: "cancelled" }];
  assert.ok(isSlotAvailable({ date: monday, time: "10:00", typeKey: "besichtigung", bookings: cancelled }));
});

test("slots: blocked dates, lead time and horizon", () => {
  const monday = nextWeekday(1);
  assert.equal(slotsForDate({ date: monday, typeKey: "besichtigung", blocked: [monday] }).length, 0);
  const now = { date: "2026-11-02", minutes: 10 * 60 }; // Monday 10:00
  assert.equal(slotsForDate({ date: "2026-11-02", typeKey: "besichtigung", now }).length, 0);
  const tue = slotsForDate({ date: "2026-11-03", typeKey: "besichtigung", now });
  assert.equal(tue[0].time, "10:00"); // 24h lead time
  assert.equal(slotsForDate({ date: "2027-03-01", typeKey: "besichtigung", now }).length, 0);
  const days = daysOverview({ from: "2026-11-02", days: 7, typeKey: "beratung", now });
  assert.equal(days.length, 7);
  assert.equal(days.find((d) => d.date === "2026-11-06").open, false); // Friday
});

test("ics: valid calendar with timezone", () => {
  const ics = bookingIcs({ id: "x1", ref: "BB-TEST", type: "beratung", date: "2026-11-03", time: "23:30", durationMinutes: 60, meetingUrl: "https://meet.jit.si/abc", customer: {} });
  assert.match(ics, /DTSTART;TZID=Europe\/Berlin:20261103T233000/);
  assert.match(ics, /DTEND;TZID=Europe\/Berlin:20261104T003000/);
  assert.match(ics, /BEGIN:VTIMEZONE/);
  assert.match(ics, /URL:https:\/\/meet.jit.si\/abc/);
});

test("calendly: signature verification", () => {
  const key = "test-signing-key";
  const body = JSON.stringify({ event: "invitee.created" });
  const t = Math.floor(Date.now() / 1000);
  const v1 = crypto.createHmac("sha256", key).update(`${t}.${body}`).digest("hex");
  assert.equal(verifyCalendlySignature(body, `t=${t},v1=${v1}`, key), true);
  assert.equal(verifyCalendlySignature(body + " ", `t=${t},v1=${v1}`, key), false);
  assert.equal(verifyCalendlySignature(body, `t=${t - 3600},v1=${v1}`, key), false);
  assert.equal(isCalendlyApiUri("https://api.calendly.com/scheduled_events/AAA"), true);
  assert.equal(isCalendlyApiUri("https://evil.example/api.calendly.com/"), false);
});

test("calendly: normalize payload to local time + meeting link", () => {
  const n = normalize({
    event: { uri: "https://api.calendly.com/scheduled_events/E1", start_time: "2026-11-03T13:00:00.000000Z", end_time: "2026-11-03T13:30:00.000000Z", location: { type: "google_conference", join_url: "https://meet.google.com/abc-defg-hij" } },
    invitee: { uri: "https://api.calendly.com/scheduled_events/E1/invitees/I1", name: "Test", email: "t@example.com", status: "active", cancel_url: "https://calendly.com/cancellations/I1" },
  });
  assert.equal(n.date, "2026-11-03");
  assert.equal(n.time, "14:00");
  assert.equal(n.durationMinutes, 30);
  assert.equal(n.meetingUrl, "https://meet.google.com/abc-defg-hij");
  assert.equal(n.status, "confirmed");
  const url = calendlyEmbedUrl("https://calendly.com/demo/video-beratung", { name: "A B", email: "a@b.de", phone: "0301" });
  assert.match(url, /name=A\+B/);
  assert.match(url, /primary_color=0e4d5c/i);
});

test("auth: tokens and password", () => {
  assert.equal(auth.checkPassword("demo"), true);
  assert.equal(auth.checkPassword("nope"), false);
  assert.equal(auth.isValidAdminSession(auth.adminSessionValue()), true);
  const tok = auth.bookingToken("abc");
  assert.equal(auth.isValidBookingToken("abc", tok), true);
  assert.equal(auth.isValidBookingToken("abd", tok), false);
  assert.match(auth.newRef("BB"), /^BB-[A-Z2-9]{4}$/);
});

test("bookings: create, double-booking rejected, admin update, customer cancel, calendly upsert", async () => {
  assert.equal(store.storageMode, "memory");
  const monday = nextWeekday(1);
  const input = { type: "beratung", service: "standard-bad", date: monday, time: "15:00", name: "Max Test", email: "max@example.com", phone: "030 123456", consent: true };
  const { booking, token } = await bookings.createWebsiteBooking(input);
  assert.equal(booking.status, "confirmed");
  assert.match(booking.meetingUrl, /^https:\/\/meet\.jit\.si\/badsanierung-berlin-/);
  assert.ok(auth.isValidBookingToken(booking.id, token));

  await assert.rejects(() => bookings.createWebsiteBooking({ ...input, email: "other@example.com" }), (e) => e.status === 409);
  await assert.rejects(() => bookings.createWebsiteBooking({ ...input, time: "08:00", type: "besichtigung" }), (e) => e.field === "street");
  await assert.rejects(() => bookings.createWebsiteBooking({ ...input, time: "08:00", consent: false }), (e) => e.field === "consent");

  const onsite = await bookings.createWebsiteBooking({ ...input, type: "besichtigung", time: "08:00", street: "Teststr. 1", zip: "10115", city: "Berlin" });
  assert.equal(onsite.booking.status, "requested");
  assert.equal(onsite.booking.meetingUrl, null);
  const updated = await bookings.updateBookingByAdmin(onsite.booking.id, { status: "confirmed", notes: "Parken im Hof" });
  assert.equal(updated.status, "confirmed");
  assert.equal(updated.notes, "Parken im Hof");

  const cancelled = await bookings.cancelByCustomer(booking.id);
  assert.equal(cancelled.status, "cancelled");
  // slot is free again
  const again = await bookings.createWebsiteBooking({ ...input, email: "third@example.com" });
  assert.equal(again.booking.status, "confirmed");

  const cal = { date: monday, time: "12:00", durationMinutes: 30, meetingUrl: "https://zoom.us/j/1", status: "confirmed", customer: { name: "Cal", email: "cal@example.com" }, calendly: { inviteeUri: "https://api.calendly.com/scheduled_events/E/invitees/I", eventUri: "https://api.calendly.com/scheduled_events/E" } };
  const c1 = await bookings.upsertCalendlyBooking(cal, { phone: "0301" });
  const c2 = await bookings.upsertCalendlyBooking({ ...cal, status: "cancelled" });
  assert.equal(c1.id, c2.id);
  assert.equal(c2.status, "cancelled");
  const c3 = await bookings.upsertCalendlyBooking({ ...cal, time: "13:00", calendly: { inviteeUri: "https://api.calendly.com/scheduled_events/E2/invitees/I2" } });
  await assert.rejects(() => bookings.updateBookingByAdmin(c3.id, { status: "cancelled" }), /Calendly/);

  const all = await store.listBookings();
  assert.ok(all.length >= 7); // 3 demo + 4 created
});
