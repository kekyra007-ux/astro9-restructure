/**
 * scripts/archive.mjs
 * Zips the contents of dist/ (without any wrapper folder) and writes
 * {PUBLIC_BRAND}.zip at the project root.
 *
 * Usage:  npm run archive   (run AFTER npm run build)
 * Reads:  .env  (PUBLIC_BRAND required)
 * Reads:  dist/
 * Writes: {brand}.zip  at project root
 */

import archiver   from 'archiver';
import { createWriteStream, existsSync } from 'fs';
import { resolve, dirname }              from 'path';
import { fileURLToPath }                 from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '..');

/* ── load env ─────────────────────────────────────────────────────── */
try {
  const { config } = await import('dotenv');
  config({ path: resolve(root, '.env') });
} catch {/* dotenv optional */}

const brand   = (process.env.PUBLIC_BRAND ?? 'site').replace(/[^a-zA-Z0-9._-]/g, '_');
const distDir = resolve(root, 'dist');
const outPath = resolve(root, `${brand}.zip`);

/* ── guards ───────────────────────────────────────────────────────── */
if (!existsSync(distDir)) {
  console.error('❌  dist/ not found — run "npm run build" first');
  process.exit(1);
}

/* ── archive ──────────────────────────────────────────────────────── */
console.log(`📦  Archiving dist/ → ${brand}.zip …`);

const output  = createWriteStream(outPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  const kb = (archive.pointer() / 1024).toFixed(1);
  console.log(`✅  ${brand}.zip created  (${kb} KB)`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') console.warn('⚠️ ', err.message);
  else throw err;
});

archive.on('error', (err) => { throw err; });

archive.pipe(output);

// Add dist/ contents directly into the ZIP root (no "dist/" wrapper)
archive.directory(distDir, false);

archive.finalize();
