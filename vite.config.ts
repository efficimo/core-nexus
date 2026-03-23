import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from "path";

export default defineConfig({
  base: "/core-nexus/",
  plugins: [
    react(),
    TanStackRouterVite(),
    {
      name: "json-enc",
      transform(code, id) {
        if (id.endsWith(".json.enc")) {
          return {
            code: `export default ${JSON.stringify(code.trim())};`,
            map: null,
          };
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});