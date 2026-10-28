// <head> metadata shared by the root layouts and pages.
import { siteConfig } from "../site.config.js";
import { DEFAULT_LANG, LANGS } from "./i18n/config.js";
import { withLang } from "./i18n/href.js";
import { t } from "./i18n/t.js";
import { siteUrl } from "./site-url.js";

// hreflang links must be absolute: NEXT_PUBLIC_SITE_URL when set, else the deployment URL.
const base = siteUrl();

export function baseMetadata(lang) {
  return {
    metadataBase: URL.canParse(base) ? new URL(base) : undefined,
    title: { default: t(siteConfig.seo.title, lang), template: `%s – ${siteConfig.company.brand}` },
    description: t(siteConfig.seo.description, lang),
    robots: siteConfig.demo.enabled ? { index: false, follow: false } : undefined,
    icons: siteConfig.company.logoUrl ? { icon: siteConfig.company.logoUrl } : undefined,
  };
}

/** hreflang alternates for one page: the same path in every language, x-default → German. */
export function languageAlternates(path = "/") {
  const languages = Object.fromEntries(LANGS.map((lang) => [lang, withLang(lang, path)]));
  return { languages: { ...languages, "x-default": withLang(DEFAULT_LANG, path) } };
}

export const siteViewport = { themeColor: siteConfig.theme.primary };
