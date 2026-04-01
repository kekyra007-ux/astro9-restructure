/**
 * pages.config.mjs
 * Single source of truth for all public pages.
 * Used by: scripts/sitemap.mjs, and any other tooling that needs the page list.
 */

export const PAGES = [
  { path: "/",         changefreq: "daily",   priority: "1.0" },
  { path: "/about",    changefreq: "weekly",  priority: "0.9" },
  { path: "/features", changefreq: "weekly",  priority: "0.8" },
  { path: "/products", changefreq: "weekly",  priority: "0.8" },
  { path: "/pricing",  changefreq: "monthly", priority: "0.8" },
  { path: "/contact",  changefreq: "monthly", priority: "0.7" },
];
