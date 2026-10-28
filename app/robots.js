import { siteConfig } from "@/site.config";
import { LANGS } from "@/lib/i18n/config";

export default function robots() {
  if (siteConfig.demo.enabled) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  const bookingPages = LANGS.map((lang) => `/${lang}/buchung`);
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", ...bookingPages] }] };
}
