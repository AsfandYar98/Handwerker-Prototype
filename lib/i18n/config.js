// Language constants. Client-safe: imports no dictionaries, so client
// components can use it without pulling every language into their bundle.

export const LANGS = ["de", "en", "pl"];
export const DEFAULT_LANG = "de";

/** Intl locale per language (dates, times, durations). */
export const LOCALES = { de: "de-DE", en: "en-GB", pl: "pl-PL" };

/** Each language named in itself, for the language switcher. */
export const LANG_NAMES = { de: "Deutsch", en: "English", pl: "Polski" };

/** Cookie that remembers the visitor's choice for the "/" redirect. */
export const LANG_COOKIE = "lang";

export const isLang = (value) => LANGS.includes(value);

/** `value` if it is a supported language, else the default (e.g. bookings stored before i18n). */
export const langOrDefault = (value) => (isLang(value) ? value : DEFAULT_LANG);

export const localeFor = (lang) => LOCALES[langOrDefault(lang)];

/**
 * Pick the language for "/": the `lang` cookie if valid, else the highest-ranked
 * supported language in Accept-Language (q-values respected), else the default.
 */
export function negotiateLang(cookieLang, acceptLanguage) {
  if (isLang(cookieLang)) return cookieLang;
  const ranked = String(acceptLanguage || "")
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.slice(2)) : 1, index };
    })
    .filter((entry) => entry.lang && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return ranked.find((entry) => isLang(entry.lang))?.lang ?? DEFAULT_LANG;
}
