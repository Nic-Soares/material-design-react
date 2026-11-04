import type { ComponentProps, ReactNode } from "react";
import { useControllableState } from "../../internal/useControllableState";
import { Button, type ButtonSize, type ButtonVariant } from "../Button/Button";
import styles from "./ConnectedButtonGroup.module.css";

export interface ConnectedButtonOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Shown instead of `icon` while selected. */
  selectedIcon?: ReactNode;
  disabled?: boolean;
}

interface CommonProps
  extends Omit<ComponentProps<"fieldset">, "defaultValue" | "onChange"> {
  /** Two to five segments, as in M3. */
  options: ConnectedButtonOption[];
  /** Defaults to `"tonal"`. */
  variant?: Exclude<ButtonVariant, "text">;
  /** Defaults to `"small"`. */
  size?: ButtonSize;
  /** Keeps at least one segment selected. */
  required?: boolean;
}

interface SingleProps extends CommonProps {
  multiple?: false;
  /** The selected segment's value, or null for none (controlled). */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

interface MultipleProps extends CommonProps {
  multiple: true;
  /** The selected segments' values (controlled). */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ConnectedButtonGroupProps = SingleProps | MultipleProps;

/**
 * The M3 Expressive connected button group: two to five toggle buttons side
 * by side, one or many selected. A native `<fieldset>` (role group): give it
 * a name with `aria-label`; each segment is a button with `aria-pressed`.
 */
export function ConnectedButtonGroup(props: ConnectedButtonGroupProps) {
  const {
    options,
    variant = "tonal",
    size = "small",
    required = false,
    multiple,
    value,
    defaultValue,
    onValueChange,
    className,
    ...rest
  } = props;

  // Single selection is stored as a list of at most one value
  const toList = (input: string | string[] | null | undefined) =>
    input == null ? [] : Array.isArray(input) ? input : [input];
  const [selected, setSelected] = useControllableState<string[]>(
    value === undefined ? undefined : toList(value),
    toList(defaultValue),
    (next) => {
      if (multiple) (onValueChange as MultipleProps["onValueChange"])?.(next);
      else (onValueChange as SingleProps["onValueChange"])?.(next[0] ?? null);
    },
  );

  const toggle = (optionValue: string) => {
    const isOn = selected.includes(optionValue);
    if (isOn && required && selected.length === 1) return;
    if (multiple) {
      const order = options.map((option) => option.value);
      const next = isOn
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue].sort(
            (a, b) => order.indexOf(a) - order.indexOf(b),
          );
      setSelected(next);
    } else {
      setSelected(isOn ? [] : [optionValue]);
    }
  };

  return (
    <fieldset
      {...rest}
      className={className ? `${styles.group} ${className}` : styles.group}
    >
      {options.slice(0, 5).map((option) => {
        const isOn = selected.includes(option.value);
        return (
          <Button
            key={option.value}
            className={styles.segment}
            variant={variant}
            size={size}
            data-size={size}
            shape="square"
            icon={
              isOn && option.selectedIcon ? option.selectedIcon : option.icon
            }
            disabled={option.disabled}
            selected={isOn}
            onSelectedChange={() => toggle(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </fieldset>
  );
}
