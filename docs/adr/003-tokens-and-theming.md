# ADR-003 — Material Design 3 tokens as the theming contract

## Status
Accepted (2026-11-03; roadmap `EP-03`).

## Context
The components come from a portfolio site where tokens grew with mixed names:
colors as `--md-sys-color-*`, typography as `--display-large-*`, elevation as
`--m3-elevation-*`, and state layers as about thirty precomputed variables per
theme (`--md-state-layers-light-on-surface-opacity-08`). The theme switched on
`body[data-theme="Light"]`. Precomputed state layers only match the colors they
were computed from: a consumer who changes the palette gets hover and press
states in the old colors. A library needs one naming scheme and a theme the
consumer controls.

## Decision
- Every token uses the Material Design 3 name as a CSS variable:
  `--md-sys-color-*`, `--md-sys-typescale-*`, `--md-sys-shape-*`,
  `--md-sys-elevation-*`, `--md-sys-state-*`, `--md-sys-motion-*`.
- Components read only these tokens, plus private variables of their own.
- The library ships default values: the light scheme on `:root`, the dark
  scheme on `[data-theme="dark"]` and under `prefers-color-scheme: dark` when
  no theme is set.
- State layers are computed with `color-mix()` from a color role and the M3
  state opacities, so they follow any palette.
- A consumer themes the library by setting the same variables. There is no
  JavaScript theme provider.

## Consequences
- Changing a color role changes every component, including its states.
- The token names are public API: renaming one is a breaking change.
- Consumers can generate the values from any source — Material Theme Builder
  or their own design tokens.
