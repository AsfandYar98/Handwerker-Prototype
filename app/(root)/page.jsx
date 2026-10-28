import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { LANG_COOKIE, negotiateLang } from "@/lib/i18n/config";

// "/" → the visitor's language: saved choice (cookie), else Accept-Language, else German.
export default async function RootPage() {
  const [jar, requestHeaders] = await Promise.all([cookies(), headers()]);
  redirect(`/${negotiateLang(jar.get(LANG_COOKIE)?.value, requestHeaders.get("accept-language"))}`);
}
