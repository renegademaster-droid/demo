import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { resolve, normalize } from "node:path";

// GDS repo lives alongside this app (e.g. gds/demo and gds/GDS)
const gdsRoot = resolve(__dirname, "../GDS");
const tokensPath = resolve(gdsRoot, "packages/tokens/figma/tokens.raw.json");
const TOKENS_PKG_ID = "@gds/tokens/figma/tokens.raw.json";
const TOKENS_VIRTUAL_ID = "\0gds-tokens-raw";

function gdsTokensPlugin() {
  return {
    name: "gds-tokens",
    enforce: "pre" as const,
    resolveId(id: string) {
      if (id === TOKENS_PKG_ID) return TOKENS_VIRTUAL_ID;
      return null;
    },
    load(id: string) {
      if (id !== TOKENS_VIRTUAL_ID) return null;
      const raw = readFileSync(tokensPath, "utf-8");
      const json = JSON.parse(raw) as { typography?: { "fonts/body"?: string } };
      const bodyFont = json.typography?.["fonts/body"];
      console.log("[gds-tokens] loaded tokens.raw.json → fonts/body:", bodyFont ?? "(none)");
      return `export default ${JSON.stringify(json)}`;
    },
    configureServer(server: import("vite").ViteDevServer) {
      server.watcher.add(tokensPath);
      server.watcher.on("change", (changedPath: string) => {
        if (normalize(resolve(changedPath)) === normalize(tokensPath)) {
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [gdsTokensPlugin(), react()],
  optimizeDeps: {
    exclude: ["@gds/react", "@gds/theme", "@gds/tokens"],
  },
  server: {
    fs: {
      // Allow this app's root (so index.html, src/, public/ can be served) and GDS (for linked packages)
      allow: [resolve(__dirname), gdsRoot],
    },
  },
});
