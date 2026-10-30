import test from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";

process.env.NEXT_PUBLIC_DEMO_MODE = "true";
delete process.env.ADMIN_PASSWORD;
delete process.env.AUTH_SECRET;
register("./helpers/next-hooks.js", import.meta.url);

const bookingsRoute = await import("../app/api/admin/bookings/route.js");
const bookingRoute = await import("../app/api/admin/bookings/[id]/route.js");
const blockedRoute = await import("../app/api/admin/blocked/route.js");
const { setRequestCookies } = await import("./helpers/next-headers.js");
const { ADMIN_COOKIE, adminSessionValue, isOpenDemoAdmin } = await import("../lib/auth.js");
const { adminBooking, maskEmail, maskPhone, STREET_HIDDEN } = await import("../lib/demo-mask.js");
const { saveBooking } = await import("../lib/store.js");
const { siteConfig } = await import("../site.config.js");

const fixture = {
  id: "open-demo-test",
  ref: "BB-TEST",
  source: "website",
  type: "besichtigung",
  date: "2099-01-05",
  time: "10:00",
  durationMinutes: 60,
  status: "requested",
  customer: { name: "Jana Muster", email: "jana.muster@example.com", phone: "0151 2345 6893", street: "Musterstraße 1", zip: "10115", city: "Berlin" },
  details: { message: "Bad neu", answers: [{ question: "Telefon", answer: "+49 30 1234567" }, { question: "Worum geht es?", answer: "Dusche" }] },
  notes: "",
  history: [],
};
await saveBooking(structuredClone(fixture));

/** Sets env vars for one test and restores them afterwards (undefined = unset). */
function withEnv(t, vars) {
  const saved = Object.fromEntries(Object.keys(vars).map((k) => [k, process.env[k]]));
  const apply = (v) => {
    for (const [k, val] of Object.entries(v)) {
      if (val === undefined) delete process.env[k];
      else process.env[k] = val;
    }
  };
  apply(vars);
  t.after(() => apply(saved));
}

const jsonRequest = (method, body) =>
  new Request("https://demo.example/api/admin", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/** Every admin API handler that requires a session, called without one unless cookies are set. */
const calls = {
  "GET bookings": () => bookingsRoute.GET(),
  "PATCH booking": () => bookingRoute.PATCH(jsonRequest("PATCH", { notes: "Test" }), { params: Promise.resolve({ id: fixture.id }) }),
  "GET blocked": () => blockedRoute.GET(),
  "POST blocked": () => blockedRoute.POST(jsonRequest("POST", { date: "2099-01-06" })),
  "DELETE blocked": () => blockedRoute.DELETE(jsonRequest("DELETE", { date: "2099-01-06" })),
};

test("open demo admin: with demo on and no ADMIN_PASSWORD, admin API routes respond 200 without a session", async (t) => {
  withEnv(t, { ADMIN_PASSWORD: undefined });
  setRequestCookies({});
  assert.equal(isOpenDemoAdmin(), true);
  for (const [name, call] of Object.entries(calls)) {
    assert.equal((await call()).status, 200, name);
  }
  // Contacts leave the API masked, so the open view never receives the real values.
  const { bookings } = await (await bookingsRoute.GET()).json();
  const c = bookings.find((b) => b.id === fixture.id).customer;
  assert.deepEqual([c.email, c.phone, c.street, c.zip, c.city], ["j…@example.com", "015…893", STREET_HIDDEN, "10115", "Berlin"]);
  const { booking } = await (await calls["PATCH booking"]()).json();
  assert.equal(booking.customer.email, "j…@example.com");
});

test("open demo admin: with ADMIN_PASSWORD set, admin API routes respond 401 without a session", async (t) => {
  withEnv(t, { ADMIN_PASSWORD: "s3cret" });
  setRequestCookies({});
  t.after(() => setRequestCookies({}));
  assert.equal(isOpenDemoAdmin(), false);
  for (const [name, call] of Object.entries(calls)) {
    assert.equal((await call()).status, 401, name);
  }
  // With a real session: 200 and nothing masked.
  setRequestCookies({ [ADMIN_COOKIE]: adminSessionValue() });
  const res = await bookingsRoute.GET();
  assert.equal(res.status, 200);
  const { bookings } = await res.json();
  assert.deepEqual(bookings.find((b) => b.id === fixture.id).customer, fixture.customer);
});

test("open demo admin: setting ADMIN_PASSWORD ends sessions from the open phase, also with AUTH_SECRET set", async (t) => {
  withEnv(t, { ADMIN_PASSWORD: undefined, AUTH_SECRET: "fixed-secret" });
  t.after(() => setRequestCookies({}));
  const openPhaseSession = adminSessionValue(); // e.g. from posting "demo" to /api/admin/login
  process.env.ADMIN_PASSWORD = "s3cret";
  setRequestCookies({ [ADMIN_COOKIE]: openPhaseSession });
  assert.equal((await bookingsRoute.GET()).status, 401);
});

test("open demo admin: masking helpers produce the documented formats", () => {
  assert.equal(maskEmail("jana.muster@example.com"), "j…@example.com");
  assert.equal(maskEmail("not-an-email"), "…");
  assert.equal(maskPhone("0151 2345 6893"), "015…893");
  assert.equal(maskPhone("+49 (30) 1234-567"), "493…567");
  assert.equal(maskPhone("123456"), "…"); // first 3 + last 3 would show every digit
});

test("open demo admin: adminBooking masks only in open demo mode and never alters the stored booking", (t) => {
  const original = structuredClone(fixture);
  withEnv(t, { ADMIN_PASSWORD: undefined });
  const masked = adminBooking(fixture);
  assert.equal(masked.customer.email, "j…@example.com");
  assert.equal(masked.customer.phone, "015…893");
  assert.equal(masked.customer.street, STREET_HIDDEN);
  assert.equal(masked.customer.name, "Jana Muster");
  assert.deepEqual(masked.details.answers, [
    { question: "Telefon", answer: "493…567" },
    { question: "Worum geht es?", answer: "Dusche" },
  ]);
  assert.deepEqual(fixture, original, "input not mutated");

  process.env.ADMIN_PASSWORD = "s3cret";
  assert.equal(adminBooking(fixture), fixture, "password-protected: unchanged");

  delete process.env.ADMIN_PASSWORD;
  // NEXT_PUBLIC_DEMO_MODE is read once into siteConfig (and inlined at build time), so toggle the config.
  siteConfig.demo.enabled = false;
  t.after(() => (siteConfig.demo.enabled = true));
  assert.equal(adminBooking(fixture), fixture, "demo mode off: unchanged");
});
