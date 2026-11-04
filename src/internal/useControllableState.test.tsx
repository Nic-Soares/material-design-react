import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  it("keeps its own value when uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<boolean>(undefined, false, onChange),
    );

    act(() => result.current[1](true));

    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("follows the given value when controlled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<boolean>(false, false, onChange),
    );

    act(() => result.current[1](true));

    expect(result.current[0]).toBe(false);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
