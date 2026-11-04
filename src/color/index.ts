// Public API of @nic-soares/material-design-react/color (ADR-006): color
// schemes built at runtime from a source color, with Material Color
// Utilities. A separate entry point, so apps that don't import it never load
// the color code.

export {
  applyScheme,
  createScheme,
  type SchemeOptions,
  type SpecVersion,
  schemeCss,
  type Variant,
} from "./scheme";
export {
  type ColorRole,
  type ContrastLevel,
  colorRoles,
  colorVariable,
} from "./tokens";
