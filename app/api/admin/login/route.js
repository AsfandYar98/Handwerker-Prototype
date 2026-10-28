import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminSessionValue, checkPassword } from "@/lib/auth";
import { json } from "@/lib/admin-session";

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 400));
    return json({ error: "Passwort stimmt nicht." }, 401);
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return json({ ok: true });
}
