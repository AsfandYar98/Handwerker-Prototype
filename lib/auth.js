import crypto from "node:crypto";
import { siteConfig } from "../site.config.js";

export const ADMIN_COOKIE = "hw_admin";

/** Admin password: ADMIN_PASSWORD, or "demo" while demo mode is on. */
export function adminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return siteConfig.demo.enabled ? "demo" : null;
}

export function usingDemoPassword() {
  return !process.env.ADMIN_PASSWORD && siteConfig.demo.enabled;
}

function secret() {
  return process.env.AUTH_SECRET || `${adminPassword() || "no-password"}:${siteConfig.slug}`;
}

export function sign(value) {
  return crypto.createHmac("sha256", secret()).update(String(value)).digest("base64url");
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a || ""));
  const y = Buffer.from(String(b || ""));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function checkPassword(input) {
  const pw = adminPassword();
  return Boolean(pw) && safeEqual(input, pw);
}

export function adminSessionValue() {
  return sign("admin-session-v1");
}

export function isValidAdminSession(value) {
  return Boolean(adminPassword()) && safeEqual(value, adminSessionValue());
}

/** Per-booking token for the customer's "manage booking" link. */
export function bookingToken(id) {
  return sign(`booking:${id}`).slice(0, 24);
}

export function isValidBookingToken(id, token) {
  return safeEqual(token, bookingToken(id));
}

export function newId() {
  return crypto.randomUUID();
}

export function newRef(prefix = "BB") {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(4);
  let s = "";
  for (const b of bytes) s += alphabet[b % alphabet.length];
  return `${prefix}-${s}`;
}

export function randomSlug(len = 10) {
  return crypto.randomBytes(len).toString("base64url").replace(/[-_]/g, "").slice(0, len).toLowerCase();
}
