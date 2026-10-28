import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/auth";
import { json } from "@/lib/admin-session";

export async function POST() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  return json({ ok: true });
}
