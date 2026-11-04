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
- A second entry point, `@nic-soares/material-design-react/color`, exports a
  helper that builds a scheme from a source color — variant, contrast level
  and light or dark as options — and returns it as the library's
  `--md-sys-color-*` variables, plus one that applies them to an element.
- Material Color Utilities is a dependency of the package, imported only by
  that entry point, and kept external in the build: it is installed next to
  the library, not copied into `dist/`, so a bundler includes it only when an
  app imports `/color`.
- The dependency is pinned to `^0.4.0`, which npm reads as `0.4.x`: a new
  minor version of a `0.x` package can break, so moving to it is a decision.
- The helper uses the same configuration as the build-time script and as
  Material Theme Builder (2021 spec, Tonal Spot), so a source color gives the
  same scheme in the library, in the committed tokens and in Theme Builder;
  tests check both.

## Consequences
- An app can recolor every component at runtime with one call, and only apps
  that do pay for the color code.
- The library follows Google's algorithm and spec updates by upgrading the
  dependency, instead of maintaining its own implementation.
- The public API now has two entry points to keep stable.
