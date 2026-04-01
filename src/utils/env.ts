/**
 * src/utils/env.ts
 * Centralized access to all PUBLIC_* environment variables.
 * Avoids scattered import.meta.env references throughout the codebase.
 */

export const ENV = {
  BRAND:  import.meta.env.PUBLIC_BRAND  ?? "",
  DOMAIN: (import.meta.env.PUBLIC_DOMAIN ?? "").replace(/\/+$/, ""),
  EMAIL:  import.meta.env.PUBLIC_EMAIL  ?? "",
  PHONE:  import.meta.env.PUBLIC_PHONE  ?? "",
  REF:    import.meta.env.PUBLIC_REF    ?? "",
  APP:    import.meta.env.PUBLIC_APP    ?? "",
} as const;

/** Returns true when /app should link to REF (no separate app URL) */
export const appIsRef = (): boolean => ENV.APP === ENV.REF || ENV.APP === "";

/** Resolves full URL for a given path */
export const siteUrl = (path = ""): string =>
  `${ENV.DOMAIN}/${path.replace(/^\//, "")}`;
