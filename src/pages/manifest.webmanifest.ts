/**
 * src/pages/manifest.webmanifest.ts
 * Dynamically generated web app manifest using env vars.
 */
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const brand = import.meta.env.PUBLIC_BRAND ?? "Casino";
  const domain = import.meta.env.PUBLIC_DOMAIN ?? site?.toString() ?? "";
  const description = `77HI- Premium online casino with exclusive bonuses, expert reviews, and trusted gaming experience.`;

  const manifest = {
    name: brand,
    short_name: brand,
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#f0c040",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "Content-Type": "application/manifest+json" },
  });
};
