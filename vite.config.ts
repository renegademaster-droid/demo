import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync } from "node:fs";
import { resolve, normalize } from "node:path";

// GDS repo lives alongside this app (e.g. gds/demo and gds/GDS); optional in CI
const gdsRoot = resolve(__dirname, "../GDS");
const tokensPath = resolve(gdsRoot, "packages/tokens/figma/tokens.raw.json");
const tokensFromNodeModules = resolve(__dirname, "node_modules/@gdesignsystem/tokens/figma/tokens.raw.json");
const TOKENS_PKG_ID = "@gds/tokens/figma/tokens.raw.json";
const TOKENS_GDS_PKG_ID = "@gdesignsystem/tokens/figma/tokens.raw.json";
const TOKENS_VIRTUAL_ID = "\0gds-tokens-raw";

function loadTokensJson(): string {
  const path = existsSync(tokensPath) ? tokensPath : existsSync(tokensFromNodeModules) ? tokensFromNodeModules : null;
  if (!path) return "export default {}";
  const raw = readFileSync(path, "utf-8");
  const json = JSON.parse(raw) as { typography?: { "fonts/body"?: string } };
  const bodyFont = json.typography?.["fonts/body"];
  console.log("[gds-tokens] loaded tokens.raw.json → fonts/body:", bodyFont ?? "(none)");
  return `export default ${JSON.stringify(json)}`;
}

function gdsTokensPlugin() {
  return {
    name: "gds-tokens",
    enforce: "pre" as const,
    resolveId(id: string) {
      if (id === TOKENS_PKG_ID || id === TOKENS_GDS_PKG_ID || id.startsWith("@gdesignsystem/tokens/figma/tokens.raw.json")) return TOKENS_VIRTUAL_ID;
      return null;
    },
    load(id: string) {
      if (id !== TOKENS_VIRTUAL_ID) return null;
      return loadTokensJson();
    },
    configureServer(server: import("vite").ViteDevServer) {
      if (!existsSync(tokensPath)) return;
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
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@emotion/react", "@emotion/styled"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "@emotion/react", "@chakra-ui/react"],
  },
  server: {
    fs: {
      allow: existsSync(gdsRoot)
        ? [resolve(__dirname), gdsRoot]
        : [resolve(__dirname)],
    },
  },
});
