/**
 * src/utils/apk.ts
 * Detects any .apk file in /public/ at build time.
 * Returns the public-relative URL or null if none found.
 */

// Use import.meta.glob to enumerate all files in public/ at build time
// Astro exposes public/ files via the root URL, not via glob—
// so we embed the APK path via a build-time glob over src.
// Strategy: scan public/ for *.apk during SSG via glob.

const apkFiles = import.meta.glob("/public/*.apk", {
  query: "?url",
  import: "default",
  eager: false,
});

export async function getApkUrl(): Promise<string | null> {
  const keys = Object.keys(apkFiles);
  if (keys.length === 0) return null;

  // Take the first .apk found
  const key = keys[0];
  // key looks like "/public/myapp.apk"
  // In Astro static build, public/ files are served from root
  const filename = key.replace(/^\/public\//, "");
  return `/${filename}`;
}

/**
 * Synchronous version using Vite's eager glob.
 * Returns the filename portion of the first .apk found, or null.
 */
const apkFilesEager = import.meta.glob("/public/*.apk", {
  eager: true,
});

export function getApkUrlSync(): string | null {
  const keys = Object.keys(apkFilesEager);
  if (keys.length === 0) return null;
  const filename = keys[0].replace(/^\/public\//, "");
  return `/${filename}`;
}
