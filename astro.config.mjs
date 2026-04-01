import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

export default defineConfig({
  output: "static",
  site: env.PUBLIC_DOMAIN || "https://example.com",

  vite: {
    resolve: {
      preserveSymlinks: true,
    },
    server: {
      fs: {
        strict: false,
      },
    },
    define: {
      "import.meta.env.PUBLIC_BRAND": JSON.stringify(
        env.PUBLIC_BRAND || ""
      ),
      "import.meta.env.PUBLIC_DOMAIN": JSON.stringify(
        env.PUBLIC_DOMAIN || ""
      ),
      "import.meta.env.PUBLIC_EMAIL": JSON.stringify(
        env.PUBLIC_EMAIL || ""
      ),
      "import.meta.env.PUBLIC_PHONE": JSON.stringify(
        env.PUBLIC_PHONE || ""
      ),
      "import.meta.env.PUBLIC_REF": JSON.stringify(
        env.PUBLIC_REF || ""
      ),
      "import.meta.env.PUBLIC_APP": JSON.stringify(
        env.PUBLIC_APP || ""
      ),
    },
  },

  build: {
    assets: "assets",
  },
});
