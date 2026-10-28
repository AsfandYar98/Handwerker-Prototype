import { siteConfig } from "@/site.config";

export default function robots() {
  if (siteConfig.demo.enabled) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/buchung"] }] };
}
