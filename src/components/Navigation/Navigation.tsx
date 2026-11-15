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
    /**
     * Pinned to the bottom of the rail, under the items: up to two
     * outlined IconButtons for actions that aren't destinations, such as
     * the language and the theme.
     */
    footer?: ReactNode;
  };

/**
 * The M3 navigation rail, for medium windows and up: a 96px column of
 * NavigationItems under an optional header, with an optional footer pinned
 * to the bottom. It renders a `<nav>` (name it); give it a block size, such
 * as the viewport's, for the footer to reach the bottom.
 *
 * Measurements follow the Material 3 Design Kit (node 58016-36879): 44px
 * above the header, 40px between header and items, 56px below. Where the
 * portfolio's Sidebar differs, the kit wins:
 * - the bottom padding is 56px, not the Sidebar's 24px;
 * - the container is `surface`, not the Sidebar's `surface-container`;
 * - the kit has no footer, so the footer's 8px gap comes from the Sidebar.
 */
export function NavigationRail({
  header,
  footer,
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
      {footer !== undefined && <div className={styles.footer}>{footer}</div>}
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
