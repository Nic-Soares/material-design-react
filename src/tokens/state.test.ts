import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Read from disk, relative to the project root Vitest runs from: Vitest
// doesn't process CSS (a ?raw import is empty), and under jsdom
// import.meta.url is not a file URL
const css = readFileSync("src/tokens/state.css", "utf8");

// The token names and values are public API (ADR-003)
describe("state tokens", () => {
  it.each([
    ["hover", "0.08"],
    ["focus", "0.1"],
    ["pressed", "0.1"],
    ["dragged", "0.16"],
  ])("sets the %s state layer opacity to %s", (state, opacity) => {
    expect(css).toContain(
      `--md-sys-state-${state}-state-layer-opacity: ${opacity};`,
    );
  });
});
