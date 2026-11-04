import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { FocusRing } from "../../foundations/FocusRing/FocusRing";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import { useControllableState } from "../../internal/useControllableState";
import type { ButtonShape, ButtonSize } from "../Button/Button";
import styles from "./IconButton.module.css";

export type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";
export type IconButtonWidth = "narrow" | "default" | "wide";

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type IconButtonProps = Omit<ComponentProps<"button">, "children"> &
  Name & {
    /** The icon (ADR-005). */
    icon: ReactNode;
    /** Shown instead of `icon` while selected, for toggle buttons. */
    selectedIcon?: ReactNode;
    /** Defaults to `"standard"`. */
    variant?: IconButtonVariant;
    /** M3 Expressive sizes; defaults to `"small"` (40px). */
    size?: ButtonSize;
    /** Defaults to `"round"`. */
    shape?: ButtonShape;
    /** Defaults to `"default"` (as wide as tall). */
    width?: IconButtonWidth;
    /** Makes it a toggle button, selected or not (controlled). */
    selected?: boolean;
    /** Makes it a toggle button that keeps its own state (uncontrolled). */
    defaultSelected?: boolean;
    /** Called with the new state when a toggle button is pressed. */
    onSelectedChange?: (selected: boolean) => void;
  };

/**
 * The M3 Expressive icon button: four variants, five sizes, three widths,
 * round or square, and a toggle mode. It has no visible label, so it needs
 * `aria-label` or `aria-labelledby` (the types require one).
 */
export function IconButton({
  icon,
  selectedIcon,
  variant = "standard",
  size = "small",
  shape = "round",
  width = "default",
  selected,
  defaultSelected,
  onSelectedChange,
  className,
  type = "button",
  disabled,
  onClick,
  ...props
}: IconButtonProps) {
  const toggles =
    selected !== undefined ||
    defaultSelected !== undefined ||
    onSelectedChange !== undefined;
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
    styles[width],
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
      <IconSlot>{isSelected && selectedIcon ? selectedIcon : icon}</IconSlot>
    </button>
  );
}
