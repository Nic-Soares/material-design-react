import {
  argbFromHex,
  Contrast,
  Hct,
  SchemeTonalSpot,
} from "@material/material-color-utilities";
import { describe, expect, it } from "vitest";
import {
  type ColorRole,
  type ContrastLevel,
  colorRoles,
  colorVariable,
  contrastLevels,
  schemeColors,
} from "./tokens";

function scheme(isDark: boolean, contrast: ContrastLevel) {
  const source = Hct.fromInt(argbFromHex("#6750A4"));
  return new SchemeTonalSpot(source, isDark, contrastLevels[contrast], "2025");
}

function contrastRatio(a: string, b: string): number {
  const toneOf = (hex: string) => Hct.fromInt(argbFromHex(hex)).tone;
  return Contrast.ratioOfTones(toneOf(a), toneOf(b));
}

// Text roles and the surfaces they sit on
const pairs: [ColorRole, ColorRole][] = [
  ["onPrimary", "primary"],
  ["onPrimaryContainer", "primaryContainer"],
  ["onSecondary", "secondary"],
  ["onSecondaryContainer", "secondaryContainer"],
  ["onTertiary", "tertiary"],
  ["onTertiaryContainer", "tertiaryContainer"],
  ["onError", "error"],
  ["onErrorContainer", "errorContainer"],
  ["onSurface", "surface"],
  ["onSurfaceVariant", "surfaceContainerHighest"],
  ["inverseOnSurface", "inverseSurface"],
];

describe("colorVariable", () => {
  it("names a role after the M3 token, in kebab case", () => {
    expect(colorVariable("primary")).toBe("--md-sys-color-primary");
    expect(colorVariable("onPrimaryContainer")).toBe(
      "--md-sys-color-on-primary-container",
    );
    expect(colorVariable("surfaceContainerHighest")).toBe(
      "--md-sys-color-surface-container-highest",
    );
  });
});

describe("schemeColors", () => {
  it("gives every role a hex color", () => {
    const colors = schemeColors(scheme(false, "standard"));

    expect(Object.keys(colors)).toEqual([...colorRoles]);
    for (const value of Object.values(colors)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  // WCAG AA for normal text is 4.5:1; M3 raises the target with each
  // contrast level, so every level must at least clear it
  for (const contrast of Object.keys(contrastLevels) as ContrastLevel[]) {
    for (const isDark of [false, true]) {
      const name = `${isDark ? "dark" : "light"}, ${contrast} contrast`;

      it(`keeps text readable on its surface (${name})`, () => {
        const colors = schemeColors(scheme(isDark, contrast));

        for (const [text, surface] of pairs) {
          const ratio = contrastRatio(colors[text], colors[surface]);
          expect(ratio, `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  }

  it("raises the contrast with each level", () => {
    const ratio = (contrast: ContrastLevel) => {
      const colors = schemeColors(scheme(false, contrast));
      return contrastRatio(colors.onSurfaceVariant, colors.surface);
    };

    expect(ratio("medium")).toBeGreaterThan(ratio("standard"));
    expect(ratio("high")).toBeGreaterThan(ratio("medium"));
  });
});
