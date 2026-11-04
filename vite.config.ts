import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// The oldest browsers with native light-dark() (2024). The color tokens rely
// on it: inside a custom property, Lightning CSS's fallback for older
// browsers resolves where the token is declared, not where it is used, which
// would break nested themes. Vite reads two forms of the same list: one for
// the CSS transform, one for the minifier. Storybook reuses the second.
export const cssBuildTarget = [
  "chrome123",
  "edge123",
  "firefox120",
  "safari17.5",
];

// Lightning CSS encodes a browser version as major << 16 | minor << 8
const version = (major: number, minor = 0) => (major << 16) | (minor << 8);

export const cssTransformTargets = {
  chrome: version(123),
  edge: version(123),
  firefox: version(120),
  safari: version(17, 5),
  ios_saf: version(17, 5),
};

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: cssTransformTargets,
      drafts: { customMedia: true },
    },
  },

  // Library mode: one ESM entry and one stylesheet (dist/styles.css).
  // React stays a peer dependency, so it is never bundled.
  // Lightning CSS compiles CSS Modules and the M3 window size classes
  // (@custom-media), so consumers need no CSS tooling of their own.
  build: {
    lib: {
      // The components and tokens, and the runtime color helper (ADR-006)
      entry: { index: "src/index.ts", color: "src/color/index.ts" },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
      cssFileName: "styles",
    },
    cssCodeSplit: false,
    cssMinify: "lightningcss",
    cssTarget: cssBuildTarget,
    sourcemap: true,
    rolldownOptions: {
      // Peers and Material Color Utilities are installed next to the
      // library, not copied into dist/ (ADR-006)
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@material\/material-color-utilities/,
      ],
    },
  },

  // Tests (Vitest): components render in jsdom; src/test/ holds the setup
  // and the axe helper, and is left out of the published package
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // Run Material Color Utilities through Vite's resolver: Node's rejects
    // its extensionless imports (scripts/resolve-extensionless.ts)
    server: { deps: { inline: ["@material/material-color-utilities"] } },
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.stories.tsx", "src/test/**", "src/index.ts"],
      reporter: ["text", "html"],
    },
  },
});
