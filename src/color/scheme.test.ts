import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import themeBuilderExport from "./__fixtures__/theme-builder-65558F.json";
import { applyScheme, createScheme, schemeCss } from "./scheme";
import { colorRoles, colorVariable } from "./tokens";

const exported = themeBuilderExport.schemes as Record<
  string,
  Record<string, string>
>;

/** `light-dark(#a, #b)` → ["#a", "#b"]; a plain color is both. */
function lightAndDark(value: string | undefined): [string, string] {
  const match = value?.match(/^light-dark\((#\w+), (#\w+)\)$/);
  return match ? [match[1] ?? "", match[2] ?? ""] : [value ?? "", value ?? ""];
}

describe("schemeCss", () => {
  // The defaults and a custom source color come from one code path
  it("reproduces the library's default color tokens", () => {
    const committed = readFileSync("src/tokens/color.css", "utf8");
    const withoutHeader = committed.replace(/^\/\*[\s\S]*?\*\/\n\n/, "");

    expect(schemeCss({ sourceColor: "#6750A4" })).toBe(withoutHeader);
  });
});

describe("createScheme", () => {
  it("gives every role a variable", () => {
    const scheme = createScheme({ sourceColor: "#6750A4" });

    expect(Object.keys(scheme)).toEqual(colorRoles.map(colorVariable));
  });

  it.each([
    ["standard", "light", "dark"],
    ["medium", "light-medium-contrast", "dark-medium-contrast"],
    ["high", "light-high-contrast", "dark-high-contrast"],
  ] as const)(
    "matches Material Theme Builder at %s contrast, light and dark",
    (contrast, lightName, darkName) => {
      const scheme = createScheme({
        sourceColor: themeBuilderExport.seed,
        contrast,
      });

      for (const role of colorRoles) {
        const [light, dark] = lightAndDark(scheme[colorVariable(role)]);
        expect(light, `${role} light`).toBe(
          exported[lightName]?.[role]?.toLowerCase(),
        );
        expect(dark, `${role} dark`).toBe(
          exported[darkName]?.[role]?.toLowerCase(),
        );
      }
    },
  );

  it("keeps roles that don't change with the theme as plain colors", () => {
    const scheme = createScheme({ sourceColor: "#6750A4" });

    expect(scheme["--md-sys-color-shadow"]).toBe("#000000");
    expect(scheme["--md-sys-color-primary"]).toMatch(/^light-dark\(/);
  });

  it("gives other colors with the 2025 spec and with another variant", () => {
    const primary = (options: Parameters<typeof createScheme>[0]) =>
      createScheme(options)["--md-sys-color-primary"];
    const standard = primary({ sourceColor: "#6750A4" });

    expect(primary({ sourceColor: "#6750A4", spec: "2025" })).not.toBe(
      standard,
    );
    expect(primary({ sourceColor: "#6750A4", variant: "vibrant" })).not.toBe(
      standard,
    );
  });
});

describe("applyScheme", () => {
  it("sets the variables on the element", () => {
    const element = document.createElement("div");

    applyScheme(element, { sourceColor: "#63A002" });

    const primary = element.style.getPropertyValue("--md-sys-color-primary");
    expect(primary).toBe(
      createScheme({ sourceColor: "#63A002" })["--md-sys-color-primary"],
    );
  });
});
