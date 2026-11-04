import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Read from disk (see state.test.ts for why)
const css = readFileSync("src/tokens/typography.css", "utf8");

const roles = ["display", "headline", "title", "body", "label"];
const sizes = ["large", "medium", "small"];
const properties = ["font", "weight", "size", "line-height", "tracking"];

// The value without whitespace: the formatter wraps long declarations
function value(token: string): string | undefined {
  return css.match(new RegExp(`${token}:([^;]+);`))?.[1]?.replace(/\s+/g, "");
}

// The token names are public API (ADR-003)
describe("typography tokens", () => {
  for (const scale of ["", "emphasized-"]) {
    it(`defines every ${scale ? "emphasized" : "baseline"} style`, () => {
      for (const role of roles) {
        for (const size of sizes) {
          for (const property of properties) {
            const token = `--md-sys-typescale-${scale}${role}-${size}-${property}`;
            expect(value(token), token).toBeDefined();
          }
        }
      }
    });
  }

  it("maps display, headline and title large to the brand typeface", () => {
    expect(value("--md-sys-typescale-display-large-font")).toBe(
      "var(--md-ref-typeface-brand)",
    );
    expect(value("--md-sys-typescale-title-large-font")).toBe(
      "var(--md-ref-typeface-brand)",
    );
    expect(value("--md-sys-typescale-title-medium-font")).toBe(
      "var(--md-ref-typeface-plain)",
    );
  });

  // Spot checks against the Material 3 Design Kit, in rem (1rem = 16px)
  it.each([
    ["--md-sys-typescale-display-large-size", "3.5625rem"],
    ["--md-sys-typescale-display-large-tracking", "-0.015625rem"],
    ["--md-sys-typescale-title-medium-tracking", "0.009375rem"],
    ["--md-sys-typescale-body-medium-tracking", "0.015625rem"],
    ["--md-sys-typescale-label-small-size", "0.6875rem"],
    [
      "--md-sys-typescale-emphasized-label-large-weight",
      "var(--md-ref-typeface-weight-semibold)",
    ],
    [
      "--md-sys-typescale-emphasized-body-large-weight",
      "var(--md-ref-typeface-weight-medium)",
    ],
    // Emphasized styles keep the baseline tracking
    ["--md-sys-typescale-emphasized-body-large-tracking", "0.03125rem"],
  ])("sets %s to %s", (token, expected) => {
    expect(value(token)).toBe(expected);
  });
});
