/**
 * src/utils/canon.ts
 * Loads canon.json and resolves canonical / hreflang for a given page slug.
 * {DOMAIN} placeholders are replaced with PUBLIC_DOMAIN at runtime.
 */

import { ENV } from "./env";
import canonRaw from "../../public/canon.json";

type HreflangEntry = { lang: string; href: string };

interface CanonEntry {
  canonical: string;
  hreflang: HreflangEntry[] | false;
}

type CanonMap = Record<string, CanonEntry>;

const canon = canonRaw as CanonMap;

function replaceDomain(str: string): string {
  return str.replaceAll("{DOMAIN}", ENV.DOMAIN);
}

export interface PageCanon {
  canonical: string;
  hreflang: HreflangEntry[] | false;
}

export function getCanon(slug: string): PageCanon {
  const entry = canon[slug] ?? canon["home"];
  const fallback = canon["home"];

  const canonical = replaceDomain(entry?.canonical ?? fallback.canonical);

  let hreflang: HreflangEntry[] | false = false;
  if (entry?.hreflang !== false && Array.isArray(entry?.hreflang)) {
    hreflang = (entry.hreflang as HreflangEntry[]).map((h) => ({
      lang: h.lang,
      href: replaceDomain(h.href),
    }));
  } else if (entry?.hreflang !== false && !entry?.hreflang) {
    // Not defined → fall back to home hreflang
    const fb = fallback.hreflang;
    if (Array.isArray(fb)) {
      hreflang = fb.map((h) => ({
        lang: h.lang,
        href: replaceDomain(h.href),
      }));
    }
  }

  return { canonical, hreflang };
}
