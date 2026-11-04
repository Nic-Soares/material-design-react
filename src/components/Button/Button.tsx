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

interface ButtonOwnProps {
  /** Defaults to `"filled"`. */
  variant?: ButtonVariant;
  /** M3 Expressive sizes; defaults to `"small"` (40px). */
  size?: ButtonSize;
  /** Defaults to `"round"`. */
  shape?: ButtonShape;
  /** A leading icon (ADR-005). */
  icon?: ReactNode;
  /**
   * Runs once the ripple of a press has faded. An app that navigates on
   * click can wait for it, so the press is seen before the page changes;
   * only call it when the ripple animates (`canRipple()`), since without
   * animation it runs before `onClick`.
   */
  onRippleEnd?: () => void;
}

/** A native `<button>`; it can be a toggle button. */
export type ButtonAsButtonProps = ComponentProps<"button"> &
  ButtonOwnProps & {
    href?: undefined;
    /**
     * Makes it a toggle button, selected or not (controlled). Text buttons
     * can't toggle in M3, so the prop is ignored for them.
     */
    selected?: boolean;
    /** Makes it a toggle button that keeps its own state (uncontrolled). */
    defaultSelected?: boolean;
    /** Called with the new state when a toggle button is pressed. */
    onSelectedChange?: (selected: boolean) => void;
  };

/**
 * A link that looks like a button: an `<a href>`, for navigation. Links
 * don't toggle. `disabled` drops the `href` and sets `aria-disabled`.
 */
export type ButtonAsLinkProps = Omit<ComponentProps<"a">, "href"> &
  ButtonOwnProps & {
    href: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

/**
 * The M3 Expressive button: five variants, five sizes, round or square, an
 * optional leading icon, and a toggle mode. It renders a native `<button>`
 * (type "button" by default), or an `<a>` when given `href`, and forwards
 * every native prop and `ref`.
 */
export function Button(props: ButtonProps) {
  return props.href !== undefined ? (
    <LinkButton {...props} />
  ) : (
    <NativeButton {...props} />
  );
}

const classesOf = (
  { variant = "filled", size = "small", shape = "round" }: ButtonOwnProps,
  extra: (string | false | undefined)[],
) =>
  [styles.button, styles[variant], styles[size], styles[shape], ...extra]
    .filter(Boolean)
    .join(" ");

const content = (
  icon: ReactNode,
  children: ReactNode,
  disabled: boolean | undefined,
  onRippleEnd: (() => void) | undefined,
) => (
  <>
    <StateLayer />
    <Ripple disabled={disabled} onFaded={onRippleEnd} />
    <FocusRing />
    {icon !== undefined && <IconSlot>{icon}</IconSlot>}
    {children !== undefined && <span className={styles.label}>{children}</span>}
  </>
);

function NativeButton({
  variant = "filled",
  size,
  shape,
  icon,
  onRippleEnd,
  selected,
  defaultSelected,
  onSelectedChange,
  className,
  children,
  type = "button",
  disabled,
  onClick,
  href: _href,
  ...props
}: ButtonAsButtonProps) {
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

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={classesOf({ variant, size, shape }, [
        toggles && styles.toggle,
        toggles && isSelected && styles.selected,
        className,
      ])}
      aria-pressed={toggles ? isSelected : undefined}
      onClick={handleClick}
    >
      {content(icon, children, disabled, onRippleEnd)}
    </button>
  );
}

function LinkButton({
  variant,
  size,
  shape,
  icon,
  onRippleEnd,
  className,
  children,
  href,
  disabled,
  ...props
}: ButtonAsLinkProps) {
  return (
    <a
      {...props}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      className={classesOf({ variant, size, shape }, [className])}
    >
      {content(icon, children, disabled, onRippleEnd)}
    </a>
  );
}
