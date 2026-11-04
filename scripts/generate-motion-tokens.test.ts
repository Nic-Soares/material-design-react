import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  settleTime,
  springPosition,
  springToCss,
} from "./generate-motion-tokens";

const expressiveFastSpatial = { damping: 0.6, stiffness: 800 };
const expressiveDefaultSpatial = { damping: 0.8, stiffness: 380 };
const expressiveSlowSpatial = { damping: 0.8, stiffness: 200 };
const defaultEffects = { damping: 1, stiffness: 1600 };

function peak(spring: { damping: number; stiffness: number }) {
  const duration = settleTime(spring);
  let max = 0;
  for (let t = 0; t <= duration; t += 0.001) {
    max = Math.max(max, springPosition(spring, t));
  }
  return max;
}

describe("springs", () => {
  it("start at 0 and settle at 1", () => {
    for (const spring of [expressiveFastSpatial, defaultEffects]) {
      expect(springPosition(spring, 0)).toBeCloseTo(0, 6);
      expect(springPosition(spring, settleTime(spring))).toBeCloseTo(1, 2);
    }
  });

  it("take longer the slower they are", () => {
    expect(settleTime(expressiveFastSpatial)).toBeLessThan(
      settleTime(expressiveDefaultSpatial),
    );
    expect(settleTime(expressiveDefaultSpatial)).toBeLessThan(
      settleTime(expressiveSlowSpatial),
    );
  });

  it("overshoot when spatial, and never when effects", () => {
    expect(peak(expressiveFastSpatial)).toBeGreaterThan(1.05);
    expect(peak(defaultEffects)).toBeLessThanOrEqual(1);
  });

  it("become a linear() easing that ends at 1, and a duration", () => {
    const { easing, duration } = springToCss(expressiveDefaultSpatial);

    expect(easing).toMatch(/^linear\(0, .*, 1\)$/);
    expect(duration).toMatch(/^\d+ms$/);
  });
});

// The committed tokens (CI also checks they match the generator)
describe("motion tokens", () => {
  const css = readFileSync("src/tokens/motion.css", "utf8");

  it.each(["fast", "default", "slow"])("define the %s springs", (speed) => {
    for (const kind of ["spatial", "effects"]) {
      for (const part of ["easing", "duration"]) {
        expect(css).toContain(
          `--md-sys-motion-spring-${speed}-${kind}-${part}:`,
        );
      }
    }
  });

  it("define the M3 durations and easings", () => {
    expect(css).toContain("--md-sys-motion-duration-short1: 50ms;");
    expect(css).toContain("--md-sys-motion-duration-extra-long4: 1000ms;");
    expect(css).toContain(
      "--md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);",
    );
  });

  it("switch to the standard springs with data-motion", () => {
    expect(css).toContain('[data-motion="standard"]');
  });
});
