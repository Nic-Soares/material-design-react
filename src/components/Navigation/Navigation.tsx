import type { ComponentProps, ReactElement, ReactNode } from "react";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import styles from "./Navigation.module.css";

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type NavigationBarProps = ComponentProps<"nav"> & Name;

/**
 * The M3 navigation bar, for compact and medium windows: three to five
 * NavigationItems side by side. It renders a `<nav>` (name it) and leaves
 * its placement, usually fixed to the bottom, to the page; it pads the
 * device's bottom safe area.
 */
export function NavigationBar({ className, ...props }: NavigationBarProps) {
  return (
    <nav
      {...props}
      className={className ? `${styles.bar} ${className}` : styles.bar}
    />
  );
}

export type NavigationRailProps = ComponentProps<"nav"> &
  Name & {
    /** Above the items: a menu button, a FAB or a logo. */
    header?: ReactNode;
  };

/**
 * The M3 navigation rail, for medium windows and up: a 96px column of
 * NavigationItems under an optional header. It renders a `<nav>` (name it).
 */
export function NavigationRail({
  header,
  className,
  children,
  ...props
}: NavigationRailProps) {
  return (
    <nav
      {...props}
      className={className ? `${styles.rail} ${className}` : styles.rail}
    >
      {header !== undefined && <div className={styles.header}>{header}</div>}
      <div className={styles.items}>{children}</div>
    </nav>
  );
}

/** What `render` receives: spread it on the router's link component. */
export type NavigationItemRenderProps = {
  className: string;
  "aria-current": "page" | undefined;
  children: ReactNode;
};

export type NavigationItemProps = Omit<ComponentProps<"a">, "children"> & {
  /** The destination's icon (ADR-005), outlined by convention. */
  icon: ReactNode;
  /** Shown instead of `icon` on the current destination, filled by convention. */
  selectedIcon?: ReactNode;
  /** The visible name of the destination. */
  label: ReactNode;
  /** The current destination: secondary-container indicator and aria-current="page". */
  selected?: boolean;
  /**
   * Renders the item through a router's link instead of an `<a>`, such as
   * `(props) => <Link to="/about" {...props} />`. The link gets the item's
   * class, aria-current and content.
   */
  render?: (props: NavigationItemRenderProps) => ReactElement;
};

/**
 * A destination in a NavigationBar or NavigationRail: an indicator pill
 * with the icon over a label. A plain link by default, or any router link
 * through `render`, so the library imports no router.
 */
export function NavigationItem({
  icon,
  selectedIcon,
  label,
  selected = false,
  render,
  className,
  ...props
}: NavigationItemProps) {
  const itemProps: NavigationItemRenderProps = {
    className: [styles.item, selected && styles.selected, className]
      .filter(Boolean)
      .join(" "),
    "aria-current": selected ? "page" : undefined,
    children: (
      <>
        <span className={styles.indicator}>
          <Ripple />
          <IconSlot className={styles.icon}>
            {selected && selectedIcon !== undefined ? selectedIcon : icon}
          </IconSlot>
        </span>
        <span className={styles.label}>{label}</span>
      </>
    ),
  };

  return render ? render(itemProps) : <a {...props} {...itemProps} />;
}
