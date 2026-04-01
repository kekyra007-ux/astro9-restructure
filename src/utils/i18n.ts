/**
 * src/utils/i18n.ts
 * Loads page content from src/locales/pages/[slug]/[lang].json
 * Uses import.meta.glob to pre-bundle all locale files.
 */

// Pre-bundle ALL locale JSON files at build time
const localeModules = import.meta.glob("../locales/pages/**/*.json", {
  eager: true,
}) as Record<string, Record<string, unknown>>;

/**
 * Loads locale data for a given page slug and language code.
 * Falls back to "en" if the requested language is unavailable.
 *
 * @param slug  - page name slug, e.g. "home", "casino"
 * @param lang  - language code, e.g. "en", "ru"
 * @returns     - the locale object, or empty object if not found
 */
export function getLocale<T = Record<string, unknown>>(
  slug: string,
  lang = "en"
): T {
  const primaryKey = `../locales/pages/${slug}/${lang}.json`;
  const fallbackKey = `../locales/pages/${slug}/en.json`;

  const data =
    localeModules[primaryKey] ??
    localeModules[fallbackKey] ??
    {};

  return data as T;
}
