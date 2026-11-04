import {
  argbFromHex,
  Contrast,
  Hct,
  SchemeTonalSpot,
} from "@material/material-color-utilities";
import { describe, expect, it } from "vitest";
import themeBuilderExport from "./__fixtures__/theme-builder-65558F.json";
import {
  type ColorRole,
  type ContrastLevel,
  colorRoles,
  colorVariable,
  contrastLevels,
  schemeColors,
} from "./tokens";

// Material Theme Builder's configuration (ADR-003)
function scheme(sourceColor: string, isDark: boolean, contrast: ContrastLevel) {
  const source = Hct.fromInt(argbFromHex(sourceColor));
  return new SchemeTonalSpot(source, isDark, contrastLevels[contrast], "2021");
}

function contrastRatio(a: string, b: string): number {
  const toneOf = (hex: string) => Hct.fromInt(argbFromHex(hex)).tone;
  return Contrast.ratioOfTones(toneOf(a), toneOf(b));
}

// Theme Builder's six schemes, by name in its export
const exportSchemes: [string, boolean, ContrastLevel][] = [
  ["light", false, "standard"],
  ["light-medium-contrast", false, "medium"],
  ["light-high-contrast", false, "high"],
  ["dark", true, "standard"],
  ["dark-medium-contrast", true, "medium"],
  ["dark-high-contrast", true, "high"],
];

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
    const colors = schemeColors(scheme("#6750A4", false, "standard"));

    expect(Object.keys(colors)).toEqual([...colorRoles]);
    for (const value of Object.values(colors)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  // A real Material Theme Builder export (source #65558F): the library must
  // produce exactly the same colors, role by role, in all six schemes
  it.each(exportSchemes)(
    "matches Material Theme Builder (%s)",
    (name, isDark, contrast) => {
      const exported = themeBuilderExport.schemes[
        name as keyof typeof themeBuilderExport.schemes
      ] as Record<string, string>;
      const colors = schemeColors(
        scheme(themeBuilderExport.seed, isDark, contrast),
      );

      for (const role of colorRoles) {
        expect(colors[role], role).toBe(exported[role]?.toLowerCase());
      }
    },
  );

  // WCAG AA for normal text is 4.5:1; M3 raises the target with each
  // contrast level, so every level must at least clear it
  it.each(exportSchemes)(
    "keeps text readable on its surface (%s)",
    (_name, isDark, contrast) => {
      const colors = schemeColors(scheme("#6750A4", isDark, contrast));

      for (const [text, surface] of pairs) {
        const ratio = contrastRatio(colors[text], colors[surface]);
        expect(ratio, `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it("raises the contrast with each level", () => {
    const ratio = (contrast: ContrastLevel) => {
      const colors = schemeColors(scheme("#6750A4", false, contrast));
      return contrastRatio(colors.onSurfaceVariant, colors.surface);
    };

    expect(ratio("medium")).toBeGreaterThan(ratio("standard"));
    expect(ratio("high")).toBeGreaterThan(ratio("medium"));
  });
});
