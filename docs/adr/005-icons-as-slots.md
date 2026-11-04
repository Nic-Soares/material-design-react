# ADR-005 — Icons are slots, not a bundled font

## Status
Accepted (2026-11-03; roadmap `EP-04`).

## Context
In the portfolio, components take an icon name (`icon="stars"`) and render
`<span class="material-symbols-outlined">`. That only works when the page has
loaded the Material Symbols font — and the portfolio loads a subset with just
the icons it uses. A library can't know which icons a consumer needs, and
bundling the full font would cost every consumer hundreds of kilobytes.

## Decision
- Components take icons as `ReactNode` (`icon`, `leadingIcon`, …): an SVG
  component, a font ligature, anything.
- The component sizes and colors the slot (`currentColor`, the M3 icon size
  for its size variant); the consumer provides the content. `IconSlot`
  (`src/foundations/`) does it: the component sets `--md-icon-size`, and an
  SVG fills the slot while an icon font takes it as its font size.
- The library ships no icon font and no icon set. The docs show how to use
  Material Symbols, the icon set M3 recommends.

## Consequences
- Consumers load only the icons they use, in the format they prefer.
- Usage is slightly longer (`icon={<Icon />}` instead of `icon="name"`).
