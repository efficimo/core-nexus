import { defineConfig } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, "favicon.ico"]],
    },
    maskable: {
      sizes: [512],
      resizeOptions: { fit: "contain", background: "#07090d" },
    },
    apple: {
      sizes: [180],
      resizeOptions: { fit: "contain", background: "#07090d" },
    },
  },
  images: ["public/icon.svg"],
});