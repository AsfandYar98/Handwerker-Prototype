// Dictionaries for the public site. Server-side entry point: imports every
// language, so client components get their strings as props instead.
import { DEFAULT_LANG, langOrDefault } from "./config.js";
import de from "./de.js";
import en from "./en.js";
import pl from "./pl.js";

export * from "./config.js";

const dictionaries = { de, en, pl };
const merged = new Map();

/**
 * UI strings for `lang` (unknown languages get German). Keys missing in a
 * translation fall back to German; in development that is logged once per language.
 */
export function getDict(lang) {
  const key = langOrDefault(lang);
  let dict = merged.get(key);
  if (!dict) {
    const own = dictionaries[key];
    if (key !== DEFAULT_LANG && process.env.NODE_ENV === "development") {
      const missing = Object.keys(de).filter((k) => !(k in own));
      if (missing.length) console.warn(`[i18n] "${key}" is missing ${missing.length} key(s), using German: ${missing.join(", ")}`);
    }
    dict = key === DEFAULT_LANG ? de : { ...de, ...own };
    merged.set(key, dict);
  }
  return dict;
}
