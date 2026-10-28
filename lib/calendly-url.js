// Client-safe: builds the Calendly inline-widget URL with prefill + brand colour.
import { siteConfig } from "../site.config.js";

export function calendlyEmbedUrl(base, { name, email, phone, message, service } = {}) {
  if (!base) return "";
  let u;
  try {
    u = new URL(base);
  } catch {
    return "";
  }
  if (name) u.searchParams.set("name", name);
  if (email) u.searchParams.set("email", email);
  // a1 / a2 prefill the event type's custom questions in order (if they exist).
  if (phone) u.searchParams.set("a1", phone);
  const note = [service, message].filter(Boolean).join(" – ");
  if (note) u.searchParams.set("a2", note);
  u.searchParams.set("hide_gdpr_banner", "1");
  u.searchParams.set("primary_color", siteConfig.theme.primary.replace("#", ""));
  u.searchParams.set("utm_source", "website");
  return u.toString();
}
