// Storage: Upstash Redis (REST) when configured, otherwise in-memory.
// On Vercel, add the "Upstash for Redis" integration from the Marketplace —
// it sets KV_REST_API_URL / KV_REST_API_TOKEN automatically.
// In-memory storage resets on every cold start: fine for a quick demo, not more.

import { siteConfig } from "../site.config.js";
import { demoBookings } from "./demo-data.js";

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

export const storageMode = URL_ && TOKEN ? "redis" : "memory";

const KEY_BOOKINGS = `${siteConfig.slug}:bookings`;
const KEY_BLOCKED = `${siteConfig.slug}:blocked`;

async function redis(command) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(`Redis error: ${json.error || res.status}`);
  return json.result;
}

function mem() {
  if (!globalThis.__hwStore) {
    globalThis.__hwStore = { bookings: new Map(), blocked: [], seeded: false };
  }
  const s = globalThis.__hwStore;
  if (!s.seeded) {
    s.seeded = true;
    if (siteConfig.demo.enabled) for (const b of demoBookings()) s.bookings.set(b.id, b);
  }
  return s;
}

export async function listBookings() {
  if (storageMode === "memory") return [...mem().bookings.values()];
  const flat = (await redis(["HGETALL", KEY_BOOKINGS])) || [];
  const out = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      out.push(JSON.parse(flat[i]));
    } catch {
      /* skip corrupt entry */
    }
  }
  return out;
}

export async function getBooking(id) {
  if (!id) return null;
  if (storageMode === "memory") return mem().bookings.get(id) || null;
  const raw = await redis(["HGET", KEY_BOOKINGS, id]);
  return raw ? JSON.parse(raw) : null;
}

export async function saveBooking(booking) {
  if (storageMode === "memory") {
    mem().bookings.set(booking.id, booking);
    return booking;
  }
  await redis(["HSET", KEY_BOOKINGS, booking.id, JSON.stringify(booking)]);
  return booking;
}

export async function getBlockedDates() {
  if (storageMode === "memory") return [...mem().blocked];
  const raw = await redis(["GET", KEY_BLOCKED]);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function setBlockedDates(dates) {
  const clean = [...new Set(dates)].sort();
  if (storageMode === "memory") {
    mem().blocked = clean;
    return clean;
  }
  await redis(["SET", KEY_BLOCKED, JSON.stringify(clean)]);
  return clean;
}
