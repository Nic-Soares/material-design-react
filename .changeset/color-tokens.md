---
"@nic-soares/material-design-react": minor
---

Add the Material Design 3 color tokens. `styles.css` now defines every color role as a `--md-sys-color-*` variable, generated with Material Color Utilities (spec 2025, Tonal Spot, source color `#6750A4`). Light and dark follow the system setting, or `data-theme="light"` / `"dark"` on any element; standard, medium and high contrast follow `data-contrast` or the system's `prefers-contrast: more`. Requires browsers with `light-dark()`: Chrome and Edge 123, Firefox 120, Safari 17.5 or later.
