import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Field, type FieldVariant } from "../../internal/Field/Field";
import { useControllableState } from "../../internal/useControllableState";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  /** A leading icon in the list (ADR-005). */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  /** The visible label, which also names the field. */
  label: string;
  options: SelectOption[];
  /** The chosen option's value (controlled); `""` for none. */
  value?: string;
  /** The value chosen at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the value the user chooses. */
  onValueChange?: (value: string) => void;
  /** Defaults to `"filled"`. */
  variant?: FieldVariant;
  /** A hint under the field, or the error message with `error`. */
  supportingText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Submits the value with a form under this name. */
  name?: string;
  id?: string;
  className?: string;
}

const GAP = 4;

const arrow = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

/**
 * The M3 select: a filled or outlined field that opens a menu of options.
 * It follows the WAI-ARIA select-only combobox: focus stays on the field
 * while arrows, Home, End and letters move through the list; Enter, Space
 * or a click chooses; Escape closes. With `name` it submits its value
 * like a native select.
 */
export function Select({
  label,
  options,
  value,
  defaultValue = "",
  onValueChange,
  variant = "filled",
  supportingText,
  error = false,
  disabled = false,
  required = false,
  name,
  id,
  className,
}: SelectProps) {
  const [current, choose] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const base = useId();
  const comboId = id ?? `${base}-combo`;
  const labelId = `${base}-label`;
  const listId = `${base}-list`;
  const supportingId = `${base}-supporting`;
  const optionId = (index: number) => `${base}-option-${index}`;

  const fieldRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectedIndex = options.findIndex((option) => option.value === current);
  const selected = options[selectedIndex];
  const enabled = options
    .map((option, index) => (option.disabled ? -1 : index))
    .filter((index) => index >= 0);

  const show = (index: number) => {
    if (disabled) return;
    setActive(index);
    setOpen(true);
  };
  const close = useCallback(() => setOpen(false), []);
  const commit = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (option.value !== current) choose(option.value);
    setOpen(false);
  };

  // Under the field, as wide as it, flipped up when there's no room
  useLayoutEffect(() => {
    if (!open) return;
    const field = fieldRef.current?.firstElementChild?.firstElementChild;
    const list = listRef.current;
    if (!field || !list) return;
    const place = () => {
      const rect = field.getBoundingClientRect();
      const height = list.offsetHeight;
      const fitsBelow = rect.bottom + GAP + height <= window.innerHeight;
      const fitsAbove = rect.top - GAP - height >= 0;
      const up = !fitsBelow && fitsAbove;
      setPosition({
        top: up ? rect.top - GAP - height : rect.bottom + GAP,
        left: rect.left,
        width: rect.width,
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  // Keep the active option in view
  useEffect(() => {
    if (!open || active < 0) return;
    document
      .getElementById(optionId(active))
      ?.scrollIntoView?.({ block: "nearest" });
  });

  // A click outside closes
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        fieldRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const step = (from: number, delta: number) => {
    const position = enabled.indexOf(from);
    if (position < 0) return delta > 0 ? enabled[0] : enabled.at(-1);
    return enabled[Math.min(enabled.length - 1, Math.max(0, position + delta))];
  };

  const typeahead = (key: string, from: number) => {
    const letter = key.toLowerCase();
    const order = [
      ...enabled.filter((i) => i > from),
      ...enabled.filter((i) => i <= from),
    ];
    return order.find((index) =>
      options[index]?.label.toLowerCase().startsWith(letter),
    );
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const { key, altKey } = event;
    const start = selectedIndex >= 0 ? selectedIndex : (enabled[0] ?? -1);

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
        event.preventDefault();
        show(start);
      } else if (key === "Home" || key === "End") {
        event.preventDefault();
        show((key === "Home" ? enabled[0] : enabled.at(-1)) ?? -1);
      } else if (key.length === 1 && /\S/.test(key)) {
        const match = typeahead(key, start);
        if (match !== undefined) show(match);
      }
      return;
    }

    if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();
      if (altKey && key === "ArrowUp") commit(active);
      else setActive(step(active, key === "ArrowDown" ? 1 : -1) ?? active);
    } else if (key === "Home" || key === "End") {
      event.preventDefault();
      setActive((key === "Home" ? enabled[0] : enabled.at(-1)) ?? active);
    } else if (key === "PageDown" || key === "PageUp") {
      event.preventDefault();
      setActive(step(active, key === "PageDown" ? 10 : -10) ?? active);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      commit(active);
    } else if (key === "Escape") {
      event.preventDefault();
      close();
    } else if (key === "Tab") {
      close();
    } else if (key.length === 1 && /\S/.test(key)) {
      const match = typeahead(key, active);
      if (match !== undefined) setActive(match);
    }
  };

  return (
    <div
      ref={fieldRef}
      className={[styles.select, className].filter(Boolean).join(" ")}
    >
      <Field
        variant={variant}
        label={label}
        labelId={labelId}
        populated={selected !== undefined}
        active={open}
        error={error}
        disabled={disabled}
        supportingText={supportingText}
        supportingId={supportingId}
        trailing={
          <IconSlot className={open ? styles.arrowUp : styles.arrow}>
            {arrow}
          </IconSlot>
        }
      >
        <div
          id={comboId}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={labelId}
          aria-describedby={
            supportingText !== undefined ? supportingId : undefined
          }
          aria-controls={listId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-activedescendant={
            open && active >= 0 ? optionId(active) : undefined
          }
          aria-disabled={disabled || undefined}
          aria-invalid={error || undefined}
          aria-required={required || undefined}
          className={styles.combobox}
          onClick={() =>
            open
              ? close()
              : show(selectedIndex >= 0 ? selectedIndex : (enabled[0] ?? -1))
          }
          onKeyDown={onKeyDown}
          onBlur={(event) => {
            if (!listRef.current?.contains(event.relatedTarget as Node))
              close();
          }}
        >
          <span className={styles.value}>{selected?.label ?? ""}</span>
        </div>
      </Field>
      {name !== undefined && (
        <input type="hidden" name={name} value={current} disabled={disabled} />
      )}
      {open &&
        createPortal(
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            className={styles.list}
            style={{
              top: position.top,
              left: position.left,
              minInlineSize: position.width,
            }}
          >
            {options.map((option, index) => (
              // biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useKeyWithClickEvents: with aria-activedescendant, focus and keys stay on the combobox (WAI-ARIA select-only combobox)
              <div
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === current}
                aria-disabled={option.disabled || undefined}
                data-active={index === active || undefined}
                className={styles.option}
                // Keep focus on the field while choosing
                onPointerDown={(event) => event.preventDefault()}
                onPointerEnter={() => !option.disabled && setActive(index)}
                onClick={() => commit(index)}
              >
                {option.icon !== undefined && (
                  <IconSlot className={styles.icon}>{option.icon}</IconSlot>
                )}
                <span className={styles.label}>{option.label}</span>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
