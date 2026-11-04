import { useCallback, useState } from "react";

/**
 * A value that is controlled when `value` is given and uncontrolled
 * otherwise (ADR-004): `selected` + `defaultSelected` + `onSelectedChange`.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );

  return [current, set];
}
