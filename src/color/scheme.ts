import {
  argbFromHex,
  type DynamicScheme,
  Hct,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
} from "@material/material-color-utilities";
import {
  type ColorRole,
  type ContrastLevel,
  colorRoles,
  colorVariable,
  contrastLevels,
  schemeColors,
} from "./tokens";

/** The M3 scheme variants. Tonal spot is the default, as in Theme Builder. */
export type Variant =
  | "tonal-spot"
  | "neutral"
  | "vibrant"
  | "expressive"
  | "fidelity"
  | "content"
  | "monochrome"
  | "rainbow"
  | "fruit-salad";

/**
 * The color spec: "2021" gives Material Theme Builder's colors (ADR-003);
 * "2025" gives the livelier M3 Expressive colors Android uses.
 */
export type SpecVersion = "2021" | "2025";

export interface SchemeOptions {
  /** The source color, as a hex string: `#6750A4`. */
  sourceColor: string;
  /** Defaults to `"tonal-spot"`. */
  variant?: Variant;
  /** Defaults to `"2021"`. */
  spec?: SpecVersion;
}

type SchemeClass = new (
  sourceColorHct: Hct,
  isDark: boolean,
  contrastLevel: number,
  specVersion?: SpecVersion,
) => DynamicScheme;

const schemeClasses: Record<Variant, SchemeClass> = {
  "tonal-spot": SchemeTonalSpot,
  neutral: SchemeNeutral,
  vibrant: SchemeVibrant,
  expressive: SchemeExpressive,
  fidelity: SchemeFidelity,
  content: SchemeContent,
  monochrome: SchemeMonochrome,
  rainbow: SchemeRainbow,
  "fruit-salad": SchemeFruitSalad,
};

function colorsFor(
  { sourceColor, variant = "tonal-spot", spec = "2021" }: SchemeOptions,
  isDark: boolean,
  contrast: ContrastLevel,
): Record<ColorRole, string> {
  const Scheme = schemeClasses[variant];
  const source = Hct.fromInt(argbFromHex(sourceColor));
  return schemeColors(
    new Scheme(source, isDark, contrastLevels[contrast], spec),
  );
}

/**
 * The `--md-sys-color-*` variables for a source color at one contrast level.
 * Each value holds light and dark, `light-dark(<light>, <dark>)`, so the
 * element's color-scheme still picks the theme; roles that are the same in
 * both (the fixed ones) are plain colors.
 */
export function createScheme(
  options: SchemeOptions & { contrast?: ContrastLevel },
): Record<string, string> {
  const contrast = options.contrast ?? "standard";
  const light = colorsFor(options, false, contrast);
  const dark = colorsFor(options, true, contrast);

  return Object.fromEntries(
    colorRoles.map((role) => [
      colorVariable(role),
      light[role] === dark[role]
        ? light[role]
        : `light-dark(${light[role]}, ${dark[role]})`,
    ]),
  );
}

/**
 * Sets a scheme's variables on an element, for it and everything inside it.
 * Inline variables take precedence over the stylesheet, so this pins one
 * contrast level: data-contrast no longer changes it on that element.
 */
export function applyScheme(
  element: HTMLElement,
  options: SchemeOptions & { contrast?: ContrastLevel },
): void {
  for (const [name, value] of Object.entries(createScheme(options))) {
    element.style.setProperty(name, value);
  }
}

function declarations(
  options: SchemeOptions,
  contrast: ContrastLevel,
  indent: string,
): string {
  return Object.entries(createScheme({ ...options, contrast }))
    .map(([name, value]) => `${indent}${name}: ${value};`)
    .join("\n");
}

/**
 * A stylesheet for a source color, with the same structure as the library's
 * own color tokens: the theme switch, the three contrast levels and the
 * system's prefers-contrast. Paste it in an app, or serve it, to theme the
 * library without JavaScript at runtime.
 */
export function schemeCss(options: SchemeOptions): string {
  return `/* Theme: the system setting by default; data-theme pins it, at any level */
:root {
  color-scheme: light dark;
}

[data-theme="light"] {
  color-scheme: light;
}

[data-theme="dark"] {
  color-scheme: dark;
}

/* Standard contrast */
:root,
[data-contrast="standard"] {
${declarations(options, "standard", "  ")}
}

/* Medium contrast */
[data-contrast="medium"] {
${declarations(options, "medium", "  ")}
}

/* High contrast: on request, or when the system asks for more contrast */
[data-contrast="high"] {
${declarations(options, "high", "  ")}
}

@media (prefers-contrast: more) {
  :root:not([data-contrast]) {
${declarations(options, "high", "    ")}
  }
}
`;
}
