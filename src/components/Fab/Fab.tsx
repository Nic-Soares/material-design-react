import type { ComponentProps, ReactNode } from "react";
import { FocusRing } from "../../foundations/FocusRing/FocusRing";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import styles from "./Fab.module.css";

export type FabSize = "small" | "regular" | "medium" | "large";
export type FabColor =
  | "primary-container"
  | "secondary-container"
  | "tertiary-container"
  | "primary"
  | "secondary"
  | "tertiary";

type Name = { "aria-label": string } | { "aria-labelledby": string };

/**
 * A FAB shows only its icon, so it needs `aria-label` or `aria-labelledby`
 * (the types require one). With `label` it is an extended FAB, named by its
 * label; extended FABs come in the regular, medium and large sizes.
 */
type FabContent =
  | ({ label?: undefined; size?: FabSize } & Name)
  | { label: ReactNode; size?: Exclude<FabSize, "small"> };

interface FabOwnProps {
  /** The icon (ADR-005). */
  icon: ReactNode;
  /** Defaults to `"primary-container"`. */
  color?: FabColor;
  /**
   * Runs once the ripple of a press has faded, as Button's: an app that
   * navigates on click can wait for it.
   */
  onRippleEnd?: () => void;
}

/** A native `<button>`. */
export type FabAsButtonProps = Omit<ComponentProps<"button">, "children"> &
  FabOwnProps &
  FabContent & { href?: undefined };

/**
 * A link that looks like a FAB: an `<a href>`, for navigation. `disabled`
 * drops the `href` and sets `aria-disabled`.
 */
export type FabAsLinkProps = Omit<ComponentProps<"a">, "children" | "href"> &
  FabOwnProps &
  FabContent & { href: string; disabled?: boolean };

export type FabProps = FabAsButtonProps | FabAsLinkProps;

/**
 * The M3 floating action button, for the screen's main action: small
 * (40px), regular (56px), medium (80px) and large (96px), in six colors,
 * and an extended FAB with a visible `label`. It renders a native
 * `<button>` (type "button" by default), or an `<a>` when given `href`, and
 * forwards every native prop and `ref`. It doesn't place itself: put it in
 * a NavigationRail's header, or fix it to a corner of the page.
 *
 * Sizes, colors and elevation follow the Material 3 Design Kit (FAB and
 * Extended FAB, the FAB in the navigation rail of node 58016-36879). The
 * kit, like M3 Expressive, has no 40px FAB: `small` keeps the M3 baseline
 * small FAB (40px, `corner-medium`, 24px icon) and isn't available extended.
 * The portfolio has no FAB to compare with.
 */
export function Fab(props: FabProps) {
  return props.href !== undefined ? (
    <LinkFab {...props} />
  ) : (
    <NativeFab {...props} />
  );
}

const classesOf = (
  size: FabSize = "regular",
  color: FabColor = "primary-container",
  extended: boolean,
  className: string | undefined,
) =>
  [
    styles.fab,
    styles[size],
    styles[color],
    extended && styles.extended,
    className,
  ]
    .filter(Boolean)
    .join(" ");

const content = (
  icon: ReactNode,
  label: ReactNode,
  disabled: boolean | undefined,
  onRippleEnd: (() => void) | undefined,
) => (
  <>
    <StateLayer />
    <Ripple disabled={disabled} onFaded={onRippleEnd} />
    <FocusRing />
    <IconSlot>{icon}</IconSlot>
    {label !== undefined && <span className={styles.label}>{label}</span>}
  </>
);

function NativeFab({
  icon,
  label,
  size,
  color,
  onRippleEnd,
  className,
  type = "button",
  disabled,
  href: _href,
  ...props
}: FabAsButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={classesOf(size, color, label !== undefined, className)}
    >
      {content(icon, label, disabled, onRippleEnd)}
    </button>
  );
}

function LinkFab({
  icon,
  label,
  size,
  color,
  onRippleEnd,
  className,
  href,
  disabled,
  ...props
}: FabAsLinkProps) {
  return (
    <a
      {...props}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      className={classesOf(size, color, label !== undefined, className)}
    >
      {content(icon, label, disabled, onRippleEnd)}
    </a>
  );
}
