/**
 * src/i18n/utils.ts
 * Foundation utilities for multi-language support.
 *
 * URL scheme:
 *   /          → English (default, no prefix)
 *   /en/...    → English (canonical alias)
 *   /ru/...    → Russian
 *
 * To add a new language:
 *   1. Add its code to LANGUAGES below.
 *   2. Create src/locales/pages/<page>/<code>.json
 *   3. Create src/pages/<code>/index.astro (and other pages)
 */

export const LANGUAGES = {
  en: 'English',
  ru: 'Russian',
} as const;

export type Lang = keyof typeof LANGUAGES;

export const DEFAULT_LANG: Lang = 'en';

/**
 * Detect language from a URL pathname.
 * /tl/...  → 'tl'
 * /        → 'en'
 */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first && first in LANGUAGES) return first as Lang;
  return DEFAULT_LANG;
}

/**
 * Strip the language prefix from a pathname.
 * /ru/page → 'page'
 * /page    → 'page'
 * /        → ''
 */
export function getSlugFromUrl(url: URL): string {
  const [, first, ...rest] = url.pathname.split('/');
  if (first && first in LANGUAGES) return rest.join('/');
  if (first) return [first, ...rest].join('/');
  return '';
}

/**
 * Build a page path for the given language and slug.
 * ('ru', 'about') → '/ru/about'
 * ('en', 'about') → '/about'
 * ('en', '')      → '/'
 */
export function buildPath(lang: Lang, slug: string): string {
  const cleanSlug = slug.replace(/^\//, '');
  return cleanSlug ? `/${lang}/${cleanSlug}` : `/${lang}/`;
}

/**
 * Return the alternate language path for the current page.
 * Used by the language switcher in the header.
 */
export function getAlternatePath(currentLang: Lang, slug: string): string {
  const targetLang: Lang = currentLang === 'en' ? 'ru' : 'en';
  return buildPath(targetLang, slug);
}

/**
 * Navigation link definitions shared across languages.
 * Localised labels live in each page's JSON locale.
 */
export const NAV_SLUGS = ['', 'about', 'features', 'products', 'pricing', 'contact'] as const;
export type NavSlug = typeof NAV_SLUGS[number];

export interface NavItem {
  label: string;
  href:  string;
  slug:  string;
}

export function buildNav(lang: Lang, labels: string[]): NavItem[] {
  return NAV_SLUGS.map((slug, i) => ({
    label: labels[i] ?? slug,
    href:  buildPath(lang, slug),
    slug:  slug || 'home',
  }));
}
