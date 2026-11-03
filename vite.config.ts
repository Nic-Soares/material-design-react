import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Library mode: one ESM entry and one stylesheet (dist/styles.css).
// React stays a peer dependency, so it is never bundled.
// Lightning CSS compiles CSS Modules and the M3 window size classes
// (@custom-media), so consumers need no CSS tooling of their own.
export default defineConfig({
  plugins: [react()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      drafts: { customMedia: true },
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "styles",
    },
    cssCodeSplit: false,
    cssMinify: "lightningcss",
    sourcemap: true,
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/],
    },
  },
});
