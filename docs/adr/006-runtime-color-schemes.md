# ADR-006 — Color schemes at runtime, from a separate entry point

## Status
Accepted (2026-11-03; roadmap `EP-03`).

## Context
The default color tokens are generated at build time (ADR-003). Material
Design 3 also describes dynamic color: a scheme computed while the app runs,
from a color the user picks or from an image. To theme the library with
another source color, a consumer today would need a separate tool and paste
the result into CSS. Material Color Utilities does the computation, but it is
about 330 kB of JavaScript before minification; consumers who keep the default
or a fixed palette shouldn't pay for it.

## Decision
- A second entry point, `@nic-soares/material-design-react/color`, exports:
  - `createScheme({ sourceColor, variant, contrast, spec })`: the library's
    `--md-sys-color-*` variables for a source color, each holding light and
    dark as `light-dark()`, so the element's color-scheme still picks the
    theme;
  - `applyScheme(element, options)`: sets them on an element. Inline
    variables win over the stylesheet, so this pins one contrast level;
  - `schemeCss(options)`: a whole stylesheet with the structure of the
    library's own color tokens (theme switch, three contrast levels,
    prefers-contrast), for apps that would rather ship CSS than run code.
- `spec` is `"2021"` by default, Material Theme Builder's colors (ADR-003),
  or `"2025"` for the M3 Expressive colors Android uses.
- Material Color Utilities is a dependency of the package, imported only by
  that entry point, and kept external in the build: it is installed next to
  the library, not copied into `dist/`, so a bundler includes it only when an
  app imports `/color`.
- The dependency is pinned to `^0.4.0`, which npm reads as `0.4.x`: a new
  minor version of a `0.x` package can break, so moving to it is a decision.
- The build-time generator calls `schemeCss()` itself, so the default
  tokens and any custom source color come from one code path; tests check
  that the default source reproduces the committed tokens exactly, and that
  a source color matches a Material Theme Builder export at every contrast
  level.

## Consequences
- An app can recolor every component at runtime with one call, and only apps
  that do pay for the color code.
- The library follows Google's algorithm and spec updates by upgrading the
  dependency, instead of maintaining its own implementation.
- The public API now has two entry points to keep stable.
- Material Color Utilities 0.4.0's extensionless imports (ADR-003) don't
  affect apps that bundle the library, but code that imports `/color` in
  plain Node (server rendering, tests) needs a bundler-style resolver until
  upstream fixes it.
