/**
 * scripts/sitemap.mjs
 * Generates public/sitemap.xml from PUBLIC_DOMAIN env var.
 *
 * Usage:  npm run sitemap
 * Reads:  .env  (PUBLIC_DOMAIN required)
 * Writes: public/sitemap.xml
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '..');

/* ── load env ─────────────────────────────────────────────────────── */
// Try dotenv if available, fall back to process.env (CI sets vars directly)
try {
  const { config } = await import('dotenv');
  config({ path: resolve(root, '.env') });
} catch {/* dotenv optional */}

const domain = (process.env.PUBLIC_DOMAIN ?? '').replace(/\/+$/, '');
if (!domain) {
  console.warn('⚠️   PUBLIC_DOMAIN is not set — sitemap URLs will be relative');
}

/* ── page list ────────────────────────────────────────────────────── */
const today = new Date().toISOString().split('T')[0];

const pages = [
  { url: '/',                priority: '1.0', changefreq: 'daily'   },
  { url: '/en/',             priority: '1.0', changefreq: 'daily'   },
  { url: '/tl/',             priority: '1.0', changefreq: 'daily'   },
  { url: '/en/about/',       priority: '0.9', changefreq: 'weekly'  },
  { url: '/tl/about/',       priority: '0.9', changefreq: 'weekly'  },
  { url: '/en/features/',    priority: '0.8', changefreq: 'weekly'  },
  { url: '/tl/features/',    priority: '0.8', changefreq: 'weekly'  },
  { url: '/en/products/',    priority: '0.8', changefreq: 'weekly'  },
  { url: '/tl/products/',    priority: '0.8', changefreq: 'weekly'  },
  { url: '/en/pricing/',     priority: '0.8', changefreq: 'monthly' },
  { url: '/tl/pricing/',     priority: '0.8', changefreq: 'monthly' },
  { url: '/en/contact/',     priority: '0.7', changefreq: 'monthly' },
  { url: '/tl/contact/',     priority: '0.7', changefreq: 'monthly' },
];

/* ── build XML ────────────────────────────────────────────────────── */
const urlNodes = pages.map(({ url, priority, changefreq }) => `  <url>
    <loc>${domain}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urlNodes}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`✅  public/sitemap.xml generated (${pages.length} URLs, domain: ${domain || '(none)'})`);
