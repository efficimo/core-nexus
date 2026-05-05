import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { copyFileSync } from "fs";

const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? "dev"),
  },
  plugins: [
    tailwindcss(),
    react(),
    tanstackRouter(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      base,
      manifest: {
        name: "Core Nexus",
        short_name: "CoreNexus",
        description: "Tableau de bord Pixel Architect",
        theme_color: "#07090d",
        background_color: "#07090d",
        display: "standalone",
        start_url: base,
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /\/data\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "nexus-data",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
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
      "@core-nexus": path.resolve(__dirname, "./src"),
    },
  },
});