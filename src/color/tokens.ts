import {
  type DynamicScheme,
  hexFromArgb,
  MaterialDynamicColors,
} from "@material/material-color-utilities";

/**
 * The Material Design 3 color roles the library exposes as tokens, in the
 * order the generated CSS lists them. Named after the methods of
 * MaterialDynamicColors.
 *
 * Left out (ADR-003): the palette key colors, which are inputs rather than
 * roles, and the `*Dim` roles, which the 2025 spec uses only on watches.
 */
export const colorRoles = [
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "inversePrimary",
  "primaryFixed",
  "primaryFixedDim",
  "onPrimaryFixed",
  "onPrimaryFixedVariant",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "secondaryFixed",
  "secondaryFixedDim",
  "onSecondaryFixed",
  "onSecondaryFixedVariant",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "tertiaryFixed",
  "tertiaryFixedDim",
  "onTertiaryFixed",
  "onTertiaryFixedVariant",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "surfaceDim",
  "surfaceBright",
  "surfaceContainerLowest",
  "surfaceContainerLow",
  "surfaceContainer",
  "surfaceContainerHigh",
  "surfaceContainerHighest",
  "inverseSurface",
  "inverseOnSurface",
  "surfaceTint",
  "outline",
  "outlineVariant",
  "background",
  "onBackground",
  "shadow",
  "scrim",
] as const satisfies readonly (keyof MaterialDynamicColors)[];

export type ColorRole = (typeof colorRoles)[number];

/** The M3 contrast levels, as MaterialDynamicColors' `contrastLevel`. */
export const contrastLevels = {
  standard: 0,
  medium: 0.5,
  high: 1,
} as const;

export type ContrastLevel = keyof typeof contrastLevels;

/** `onPrimaryContainer` → `--md-sys-color-on-primary-container` */
export function colorVariable(role: ColorRole): string {
  const kebab = role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return `--md-sys-color-${kebab}`;
}

const dynamicColors = new MaterialDynamicColors();

/** Every role of a scheme, as a hex color. */
export function schemeColors(scheme: DynamicScheme): Record<ColorRole, string> {
  const entries = colorRoles.map((role) => {
    const argb = dynamicColors[role]().getArgb(scheme);
    return [role, hexFromArgb(argb)] as const;
  });
  return Object.fromEntries(entries) as Record<ColorRole, string>;
}
