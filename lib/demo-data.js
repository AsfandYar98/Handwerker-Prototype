// A few sample bookings so the admin dashboard isn't empty in demo mode
// (only used with in-memory storage). All names are fictional.
import { siteConfig } from "../site.config.js";
import { addDays, nowIn, weekday } from "./time.js";

function nextWorkday(from, skip) {
  let d = from;
  let found = 0;
  for (let i = 0; i < 30; i++) {
    d = addDays(d, 1);
    if (siteConfig.availability.weeklyHours[weekday(d)]) {
      if (found === skip) return d;
      found++;
    }
  }
  return d;
}

export function demoBookings() {
  const today = nowIn(siteConfig.timezone).date;
  const base = {
    source: "website",
    notes: "",
    demo: true,
    createdAt: new Date().toISOString(),
  };
  return [
    {
      ...base,
      id: "demo-1",
      ref: "BB-4K7Q",
      type: "besichtigung",
      service: "hochwertiges-bad",
      date: nextWorkday(today, 1),
      time: "09:00",
      durationMinutes: 60,
      status: "requested",
      customer: { name: "Jana Beispiel", email: "jana@example.com", phone: "0170 0000001", street: "Musterstraße 12", zip: "10405", city: "Berlin" },
      details: { bathroomSize: "6–10 m²", timeframe: "In 1–3 Monaten", message: "Wanne soll raus, gern bodengleiche Dusche." },
      history: [{ at: base.createdAt, action: "Angefragt über Website" }],
    },
    {
      ...base,
      id: "demo-2",
      ref: "BB-8M2T",
      type: "beratung",
      service: "seniorengerechtes-bad",
      date: nextWorkday(today, 2),
      time: "14:30",
      durationMinutes: 30,
      status: "confirmed",
      meetingUrl: `${siteConfig.meeting.baseUrl}/${siteConfig.slug}-BB-8M2T-demo`,
      customer: { name: "Horst Muster", email: "horst@example.com", phone: "030 0000002" },
      details: { bathroomSize: "unter 6 m²", timeframe: "So bald wie möglich", message: "Für meine Mutter, Pflegegrad 2." },
      history: [{ at: base.createdAt, action: "Gebucht über Website – Video-Link versendet" }],
    },
    {
      ...base,
      id: "demo-3",
      ref: "BB-2R9D",
      type: "besichtigung",
      service: "badezimmer-renovieren",
      date: nextWorkday(today, 4),
      time: "11:00",
      durationMinutes: 60,
      status: "confirmed",
      customer: { name: "Aylin Test", email: "aylin@example.com", phone: "0151 0000003", street: "Beispielweg 3", zip: "13086", city: "Berlin" },
      details: { bathroomSize: "6–10 m²", timeframe: "Flexibel", message: "" },
      history: [
        { at: base.createdAt, action: "Angefragt über Website" },
        { at: base.createdAt, action: "Bestätigt" },
      ],
    },
  ];
}
