import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  isoDate,
  monthWeeks,
  sameDay,
  startOfDay,
} from "./dates";

describe("dates", () => {
  it("adds days and months across their ends", () => {
    expect(addDays(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 1));
    expect(addMonths(new Date(2026, 0, 31), 1)).toEqual(new Date(2026, 1, 28));
    expect(addMonths(new Date(2026, 0, 15), -1)).toEqual(
      new Date(2025, 11, 15),
    );
  });

  it("lays a month out in full weeks from the first weekday", () => {
    // February 2026 starts on a Sunday
    const sunday = monthWeeks(new Date(2026, 1, 1), 0);
    expect(sunday).toHaveLength(4);
    expect(sunday[0]?.[0]).toEqual(new Date(2026, 1, 1));

    const monday = monthWeeks(new Date(2026, 1, 1), 1);
    expect(monday[0]?.slice(0, 6)).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(monday[0]?.[6]).toEqual(new Date(2026, 1, 1));
    expect(monday.flat().filter(Boolean)).toHaveLength(28);
  });

  it("compares days and writes ISO dates", () => {
    expect(
      sameDay(startOfDay(new Date(2026, 4, 3, 15)), new Date(2026, 4, 3)),
    ).toBe(true);
    expect(sameDay(null, new Date())).toBe(false);
    expect(isoDate(new Date(2026, 4, 3))).toBe("2026-05-03");
    expect(isoDate(null)).toBe("");
  });
});
