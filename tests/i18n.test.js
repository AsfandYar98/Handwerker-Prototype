import test from "node:test";
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_DEMO_MODE = "true";

const { default: de } = await import("../lib/i18n/de.js");
const { default: en } = await import("../lib/i18n/en.js");
const { default: pl } = await import("../lib/i18n/pl.js");
const { getDict, LANGS, negotiateLang } = await import("../lib/i18n/index.js");
const { withLang, switchLang } = await import("../lib/i18n/href.js");
const { t } = await import("../lib/i18n/t.js");
const { fill, formatDateTime, formatDuration } = await import("../lib/i18n/format.js");
const { siteConfig } = await import("../site.config.js");
const { addDays, nowIn, weekday } = await import("../lib/time.js");
const { bookingIcs } = await import("../lib/ics.js");
const bookings = await import("../lib/bookings.js");

const translations = { en, pl };
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
// Placeholders a translation may leave out on purpose.
const OPTIONAL_PLACEHOLDERS = { pl: { "mail.greeting": ["name"] } }; // Polish greeting with a name needs vocative + gender

test("i18n: LANGS matches the dictionaries", () => {
  assert.deepEqual(LANGS, ["de", "en", "pl"]);
});

for (const [lang, dict] of Object.entries(translations)) {
  test(`i18n: ${lang} has exactly the keys of de`, () => {
    assert.deepEqual(Object.keys(de).filter((k) => !(k in dict)), [], `missing in ${lang}.js`);
    assert.deepEqual(Object.keys(dict).filter((k) => !(k in de)), [], `in ${lang}.js but not in de.js`);
  });

  test(`i18n: ${lang} uses the same {placeholders} as de`, () => {
    for (const key of Object.keys(de)) {
      const optional = OPTIONAL_PLACEHOLDERS[lang]?.[key] || [];
      const expected = placeholders(de[key]).filter((p) => !optional.includes(p));
      const actual = placeholders(dict[key]).filter((p) => !optional.includes(p));
      assert.deepEqual(actual, expected, `${lang}.js "${key}"`);
    }
  });
}

test("i18n: no empty strings in any dictionary", () => {
  for (const [lang, dict] of Object.entries({ de, en, pl })) {
    for (const [key, value] of Object.entries(dict)) {
      assert.equal(typeof value, "string", `${lang}.js "${key}" is not a string`);
      assert.notEqual(value.trim(), "", `${lang}.js "${key}" is empty`);
    }
  }
});

test("i18n: every localised text in site.config.js has all languages", () => {
  const problems = [];
  (function walk(node, path) {
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
    if (!node || typeof node !== "object") return;
    if (typeof node.de === "string") {
      for (const lang of LANGS) if (typeof node[lang] !== "string" || !node[lang].trim()) problems.push(`${path}.${lang}`);
      return;
    }
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
  })(siteConfig, "");
  assert.deepEqual(problems, []);
});

test("i18n: getDict falls back to German", () => {
  assert.equal(getDict("en")["nav.services"], "Services");
  assert.equal(getDict("xx"), getDict("de"));
  assert.equal(getDict(undefined)["cta.book"], "Termin buchen");
});

test("i18n: t() resolves config values", () => {
  assert.equal(t({ de: "Bad", en: "Bathroom" }, "en"), "Bathroom");
  assert.equal(t({ de: "Bad", en: "Bathroom" }, "pl"), "Bad");
  assert.equal(t("Viega", "pl"), "Viega");
  assert.equal(t(undefined, "en"), undefined);
});

test("i18n: withLang / switchLang", () => {
  assert.equal(withLang("en", "/"), "/en");
  assert.equal(withLang("en", "/termin"), "/en/termin");
  assert.equal(withLang("pl", "/#leistungen"), "/pl#leistungen");
  assert.equal(withLang("de", "/termin?leistung=standard-bad"), "/de/termin?leistung=standard-bad");
  assert.equal(switchLang("/de/termin", "en"), "/en/termin");
  assert.equal(switchLang("/de", "pl"), "/pl");
  assert.equal(switchLang("/en/leistungen/standard-bad", "de"), "/de/leistungen/standard-bad");
  assert.equal(switchLang("/termin", "en"), "/en/termin");
});

test("i18n: negotiateLang — cookie, then Accept-Language (q-values), then de", () => {
  assert.equal(negotiateLang("pl", "en-US,en;q=0.9"), "pl");
  assert.equal(negotiateLang("fr", "en-US,en;q=0.9"), "en");
  assert.equal(negotiateLang(undefined, "fr-FR,fr;q=0.9,pl;q=0.8,en;q=0.7"), "pl");
  assert.equal(negotiateLang(undefined, "en;q=0.5,pl;q=0.9"), "pl");
  assert.equal(negotiateLang(undefined, "en;q=0,fr"), "de");
  assert.equal(negotiateLang(undefined, ""), "de");
  assert.equal(negotiateLang(undefined, null), "de");
});

test("i18n: date, time and duration formatting per locale", () => {
  assert.equal(formatDateTime(getDict("de"), "de", "2026-11-03", "10:00"), "Dienstag, 3. November 2026, 10:00 Uhr");
  assert.match(formatDateTime(getDict("en"), "en", "2026-11-03", "10:00"), /^Tuesday,? 3 November 2026 at 10:00$/);
  assert.equal(formatDateTime(getDict("pl"), "pl", "2026-11-03", "10:00"), "wtorek, 3 listopada 2026, godz. 10:00");
  assert.equal(formatDuration(30, "pl"), "30 minut");
  assert.equal(formatDuration(30, "de"), "30 Minuten");
  assert.equal(fill("{a} {b} {a}", { a: 1 }), "1 {b} 1");
});

function nextWeekday(target) {
  let d = addDays(nowIn("Europe/Berlin").date, 10);
  while (weekday(d) !== target) d = addDays(d, 1);
  return d;
}

test("bookings: language is stored, errors and customer emails follow it, company side stays German", async () => {
  const tuesday = nextWeekday(2);
  const input = {
    type: "beratung",
    service: "standard-bad",
    date: tuesday,
    time: "15:00",
    name: "Ola Test",
    email: "ola@example.com",
    phone: "030 123456",
    consent: true,
    bathroomSize: "small",
    timeframe: "asap",
  };

  await assert.rejects(
    () => bookings.createWebsiteBooking({ ...input, lang: "en", consent: false }),
    (e) => e.field === "consent" && e.message === en["error.consent"]
  );

  const logs = [];
  const origLog = console.log;
  console.log = (...args) => logs.push(args.join(" "));
  let created;
  try {
    created = await bookings.createWebsiteBooking({ ...input, lang: "pl" });
  } finally {
    console.log = origLog;
  }
  const { booking } = created;
  assert.equal(booking.lang, "pl");
  assert.equal(booking.details.bathroomSize, "unter 6 m²"); // German for the company
  assert.equal(booking.details.timeframe, "So bald wie möglich");
  assert.ok(logs.some((l) => l.includes("Potwierdzenie konsultacji wideo:") && l.includes("godz. 15:00")), logs.join("\n"));
  assert.ok(logs.some((l) => l.includes("Gebucht: Video-Beratung")), logs.join("\n"));

  const ics = bookingIcs(booking);
  assert.match(ics, /SUMMARY:Konsultacja wideo – Badsanierung Berlin/);
  assert.match(ics, /Numer rezerwacji: /);
  assert.match(bookingIcs(booking, { lang: "de" }), /SUMMARY:Video-Beratung – Badsanierung Berlin/);

  await assert.rejects(
    () => bookings.createWebsiteBooking({ ...input, lang: "pl", email: "x@example.com" }),
    (e) => e.status === 409 && e.message === pl["error.slotTaken"]
  );

  const legacy = await bookings.createWebsiteBooking({ ...input, time: "11:00", email: "legacy@example.com" });
  assert.equal(legacy.booking.lang, "de"); // no lang → German
});
