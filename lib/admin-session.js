import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminSession } from "./auth.js";

export async function isAdmin() {
  const jar = await cookies();
  return isValidAdminSession(jar.get(ADMIN_COOKIE)?.value);
}

export function json(data, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function unauthorized() {
  return json({ error: "Nicht angemeldet." }, 401);
}

export function errorResponse(err) {
  if (err && typeof err.status === "number") return json({ error: err.message, field: err.field }, err.status);
  console.error(err);
  return json({ error: "Unerwarteter Fehler. Bitte versuchen Sie es erneut." }, 500);
}
