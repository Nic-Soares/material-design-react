---
"@nic-soares/material-design-react": minor
---

Add the `/color` entry point for dynamic color: `createScheme()`, `applyScheme()` and `schemeCss()` build the `--md-sys-color-*` tokens from any source color with Material Color Utilities, as Material Theme Builder does, with a variant, a contrast level and a `spec` option (`"2021"`, Theme Builder's colors, or `"2025"`, the M3 Expressive colors Android uses). Apps that don't import `/color` don't load it.
