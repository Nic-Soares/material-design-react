import {
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
  useRef,
} from "react";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { useControllableState } from "../../internal/useControllableState";
import { IconButton } from "../IconButton/IconButton";
import styles from "./SearchBar.module.css";

const searchIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.6 21 13.3 14.7q-.75.6-1.73.95T9.5 16q-2.72 0-4.61-1.89T3 9.5t1.89-4.61T9.5 3t4.61 1.89T16 9.5q0 1.1-.35 2.08t-.95 1.72l6.3 6.3zM9.5 14q1.88 0 3.19-1.31T14 9.5t-1.31-3.19T9.5 5 6.31 6.31 5 9.5t1.31 3.19T9.5 14" />
  </svg>
);

const closeIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6z" />
  </svg>
);

export interface SearchBarProps
  extends Omit<ComponentProps<"input">, "value" | "defaultValue" | "type"> {
  /** The query (controlled). */
  value?: string;
  defaultValue?: string;
  /** Called with the new query as the user types or clears it. */
  onValueChange?: (value: string) => void;
  /** The clear button's accessible name. Defaults to "Clear search". */
  clearLabel?: string;
  /** Replaces the search icon. */
  leading?: ReactNode;
  /** After the field: an avatar or an icon button. */
  trailing?: ReactNode;
}

/**
 * The M3 search bar: a native `<input type="search">` (role searchbox) in a
 * pill, with a clear button once there is a query. Escape clears the query,
 * then leaves the field. Name it with `aria-label`, or a `<label>`.
 */
export function SearchBar({
  value,
  defaultValue,
  onValueChange,
  clearLabel = "Clear search",
  leading,
  trailing,
  className,
  disabled,
  onChange,
  onKeyDown,
  ref,
  ...props
}: SearchBarProps) {
  const [query, setQuery] = useControllableState(
    value,
    defaultValue ?? "",
    onValueChange,
  );
  const input = useRef<HTMLInputElement | null>(null);

  const setRefs = (element: HTMLInputElement | null) => {
    input.current = element;
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    setQuery(event.target.value);
  };

  const clear = () => {
    setQuery("");
    input.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== "Escape") return;
    event.preventDefault();
    if (query) clear();
    else input.current?.blur();
  };

  return (
    <div
      className={[styles.bar, disabled && styles.disabled, className]
        .filter(Boolean)
        .join(" ")}
    >
      <IconSlot className={styles.leading}>{leading ?? searchIcon}</IconSlot>
      <input
        {...props}
        ref={setRefs}
        type="search"
        value={query}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={styles.input}
      />
      {query && !disabled && (
        <IconButton icon={closeIcon} aria-label={clearLabel} onClick={clear} />
      )}
      {trailing}
    </div>
  );
}
