import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    tanstackRouter(),
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
    {
      name: "copy-404",
      closeBundle() {
        copyFileSync(
          path.resolve("dist", "index.html"),
          path.resolve("dist", "404.html"),
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});