import { isLang } from "./config.js";

/** Prefix an internal path with the language: "/termin" → "/en/termin", "/#kontakt" → "/en#kontakt". */
export function withLang(lang, path = "/") {
  if (path === "/" || path === "") return `/${lang}`;
  if (path.startsWith("/#") || path.startsWith("/?")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}

/** The same page in another language: swaps only the leading language segment. */
export function switchLang(pathname, lang) {
  const [, first = "", ...rest] = pathname.split("/");
  return isLang(first) ? ["", lang, ...rest].join("/") : withLang(lang, pathname);
}
