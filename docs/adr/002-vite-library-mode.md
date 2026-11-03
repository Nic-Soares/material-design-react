# ADR-002 — Build with Vite in library mode, types with tsc

## Status
Accepted (2026-11-03; roadmap `EP-01`).

## Context
The starter built with tsup, which has been in maintenance mode since August
2025; its README points to tsdown. The components use CSS Modules and the M3
window size classes as `@custom-media`, which no browser understands, so the
build must compile them — otherwise every consumer would need the same CSS
tooling. Consumers use React 19 and modern bundlers; CommonJS output serves
none of them.

## Decision
- Vite in library mode: one entry (`src/index.ts`), ES modules only, React and
  React DOM external.
- Lightning CSS compiles CSS Modules and custom media; all CSS goes to one
  file, `dist/styles.css`, exported as `./styles.css`.
- `tsc -p tsconfig.build.json` emits the type declarations.
- `sideEffects: ["**/*.css"]`, so bundlers tree-shake the JavaScript and keep
  the stylesheet.

## Consequences
- Consumers import plain ESM and one stylesheet; they need no CSS plugin.
- The build uses the same tool as the consumers' apps and the docs
  (Storybook runs on Vite).
- One stylesheet holds every component's styles, so a consumer that uses
  few components still loads all of them. Splitting CSS per component is
  revisited if the stylesheet grows large.
