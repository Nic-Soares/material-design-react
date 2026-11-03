# ADR-004 — A native-first component API

## Status
Accepted (2026-11-03; roadmap `EP-05`).

## Context
The portfolio's components were written for one site. Their props hide native
attributes (`style` picks a variant, so inline styles can't be passed; `type`
picks a shape, so `type="submit"` can't be set), they forward neither `ref`
nor other props (no `id`, `data-*` or free `aria-*`), they take `ariaLabel`
instead of `aria-label`, and `onClick` receives a custom argument. A library
is used in places its author didn't foresee; it should behave like the HTML
element it renders.

## Decision
- Each component renders the right native element and accepts that element's
  props, spread onto it, with `ref` (a prop in React 19).
- Variant props use names that don't collide with HTML: `variant`, `size`,
  `shape`.
- Accessibility uses the native attributes (`aria-label`, `aria-pressed`, …).
- Event handlers keep their DOM signatures. A value change gets its own
  callback (for example `onSelectedChange(selected)`), next to a controlled
  prop (`selected`) and an uncontrolled default (`defaultSelected`).
- `className` and `style` are merged with the component's own.

## Consequences
- Consumers can do with a component what they can do with its element.
- The portfolio adapts its call sites when it moves to the library
  (roadmap `EP-09`).
- Every component's types extend its element's props, so TypeScript catches
  invalid attributes.
