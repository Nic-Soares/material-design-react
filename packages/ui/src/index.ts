"use client";
// Entry point for the @repo/ui package.
// - Ensures global design tokens / CSS are included in the build.
// - Re-exports components so consumers can import from "@repo/ui".
//
// Important:
//  - tsup will collect all imported CSS (including CSS Modules) and produce `dist/index.css`.
//  - package.json maps "./styles.css" -> "./dist/index.css" so consumers can `import "@repo/ui/styles.css"`.
//
// Keep this file small and only export public API surface.
