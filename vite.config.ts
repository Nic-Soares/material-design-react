import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      drafts: { customMedia: true },
    },
  },

  // Library mode: one ESM entry and one stylesheet (dist/styles.css).
  // React stays a peer dependency, so it is never bundled.
  // Lightning CSS compiles CSS Modules and the M3 window size classes
  // (@custom-media), so consumers need no CSS tooling of their own.
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

  // Tests (Vitest): components render in jsdom; src/test/ holds the setup
  // and the axe helper, and is left out of the published package
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.stories.tsx", "src/test/**", "src/index.ts"],
      reporter: ["text", "html"],
    },
  },
});
