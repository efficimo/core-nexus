import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";
import { copyFileSync } from "fs";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "dev"),
  },
  plugins: [
    react(),
    tanstackRouter(),
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