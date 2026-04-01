/**
 * scripts/favicon.mjs
 * Generates all favicon / icon variants from public/img/favicon.png
 *
 * Outputs:
 *   public/favicon.ico        — 16×16 + 32×32 ICO (PNG-in-ICO)
 *   public/img/favicon.png    — 32×32 PNG (overwrite source to normalised size)
 *   public/icon-192.png       — 192×192 PNG  (manifest icon)
 *   public/icon-512.png       — 512×512 PNG  (manifest icon)
 *   public/apple-touch-icon.png — 180×180 PNG
 */

import sharp from 'sharp';
import { writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '..');
const src       = resolve(root, 'public/img/favicon.png');

if (!existsSync(src)) {
  console.error('❌  Source not found: public/img/favicon.png');
  process.exit(1);
}

/* ── helpers ──────────────────────────────────────────────────────── */

/** Build a minimal ICO binary from one or more PNG buffers. */
function buildIco(pngBuffers) {
  const count      = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let   dataOffset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0,     0); // reserved
  header.writeUInt16LE(1,     2); // type = icon
  header.writeUInt16LE(count, 4);

  const entries = pngBuffers.map((png) => {
    const w   = png.readUInt32BE(16); // IHDR width
    const h   = png.readUInt32BE(20); // IHDR height
    const ent = Buffer.alloc(16);
    ent[0] = w >= 256 ? 0 : w;
    ent[1] = h >= 256 ? 0 : h;
    ent[2] = 0;  // colour count (0 = no palette)
    ent[3] = 0;  // reserved
    ent.writeUInt16LE(1,          4); // colour planes
    ent.writeUInt16LE(32,         6); // bits per pixel
    ent.writeUInt32LE(png.length, 8);
    ent.writeUInt32LE(dataOffset, 12);
    dataOffset += png.length;
    return ent;
  });

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

/* ── main ─────────────────────────────────────────────────────────── */

async function run() {
  console.log('🎨  Generating favicons from public/img/favicon.png …');

  const [png16, png32, png180, png192, png512] = await Promise.all([
    sharp(src).resize(16,  16,  { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toBuffer(),
    sharp(src).resize(32,  32,  { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toBuffer(),
    sharp(src).resize(180, 180, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toBuffer(),
    sharp(src).resize(192, 192, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toBuffer(),
    sharp(src).resize(512, 512, { fit: 'contain', background: { r:0,g:0,b:0,alpha:0 } }).png().toBuffer(),
  ]);

  writeFileSync(resolve(root, 'public/favicon.ico'),          buildIco([png16, png32]));
  writeFileSync(resolve(root, 'public/img/favicon.png'),      png32);
  writeFileSync(resolve(root, 'public/apple-touch-icon.png'), png180);
  writeFileSync(resolve(root, 'public/icon-192.png'),         png192);
  writeFileSync(resolve(root, 'public/icon-512.png'),         png512);

  console.log('✅  favicon.ico  (16×16, 32×32)');
  console.log('✅  img/favicon.png  (32×32)');
  console.log('✅  apple-touch-icon.png  (180×180)');
  console.log('✅  icon-192.png  (192×192)');
  console.log('✅  icon-512.png  (512×512)');
}

run().catch((err) => { console.error(err); process.exit(1); });
