import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { FocusRing } from "../../foundations/FocusRing/FocusRing";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import { useControllableState } from "../../internal/useControllableState";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "filled"
  | "tonal"
  | "outlined"
  | "text"
  | "elevated";
export type ButtonSize = "xsmall" | "small" | "medium" | "large" | "xlarge";
export type ButtonShape = "round" | "square";

export interface ButtonProps extends ComponentProps<"button"> {
  /** Defaults to `"filled"`. */
  variant?: ButtonVariant;
  /** M3 Expressive sizes; defaults to `"small"` (40px). */
  size?: ButtonSize;
  /** Defaults to `"round"`. */
  shape?: ButtonShape;
  /** A leading icon (ADR-005). */
  icon?: ReactNode;
  /**
   * Makes it a toggle button, selected or not (controlled). Text buttons
   * can't toggle in M3, so the prop is ignored for them.
   */
  selected?: boolean;
  /** Makes it a toggle button that keeps its own state (uncontrolled). */
  defaultSelected?: boolean;
  /** Called with the new state when a toggle button is pressed. */
  onSelectedChange?: (selected: boolean) => void;
}

/**
 * The M3 Expressive button: five variants, five sizes, round or square, an
 * optional leading icon, and a toggle mode. It renders a native `<button>`
 * (type "button" by default) and forwards every native prop and `ref`.
 */
export function Button({
  variant = "filled",
  size = "small",
  shape = "round",
  icon,
  selected,
  defaultSelected,
  onSelectedChange,
  className,
  children,
  type = "button",
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const toggles =
    variant !== "text" &&
    (selected !== undefined ||
      defaultSelected !== undefined ||
      onSelectedChange !== undefined);
  const [isSelected, setSelected] = useControllableState(
    selected,
    defaultSelected ?? false,
    onSelectedChange,
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (toggles && !event.defaultPrevented) setSelected(!isSelected);
  };

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    styles[shape],
    toggles && styles.toggle,
    toggles && isSelected && styles.selected,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={classes}
      aria-pressed={toggles ? isSelected : undefined}
      onClick={handleClick}
    >
      <StateLayer />
      <Ripple disabled={disabled} />
      <FocusRing />
      {icon !== undefined && <IconSlot>{icon}</IconSlot>}
      {children !== undefined && (
        <span className={styles.label}>{children}</span>
      )}
    </button>
  );
}
