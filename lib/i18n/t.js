/**
 * Resolve a localisable config value: `{ de, en, pl }` → the entry for `lang`
 * (German if that language is missing); plain strings and other values pass
 * through unchanged, so untranslated configs keep working.
 */
export function t(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value[lang] ?? value.de;
  return value;
}
