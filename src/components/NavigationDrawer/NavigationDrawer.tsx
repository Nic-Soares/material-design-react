import {
  type ComponentProps,
  createContext,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useContext,
} from "react";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { useModalDialog } from "../../internal/useModalDialog";
import styles from "./NavigationDrawer.module.css";

const DrawerContext = createContext<{ close: () => void }>({
  close: () => {},
});

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type NavigationDrawerProps = Omit<
  ComponentProps<"dialog">,
  "open" | "onClose"
> &
  Name & {
    /** Whether the drawer is shown, as a modal over the page. */
    open: boolean;
    /** Called on Escape, a click on the scrim, or a chosen item. */
    onClose: () => void;
    /** A title above the items, such as the app's name. */
    headline?: ReactNode;
  };

/**
 * The M3 modal navigation drawer, for compact windows: a sheet of
 * NavigationDrawerItems that slides in from the start edge over a scrim,
 * on a native modal `<dialog>` (focus stays inside and returns on close).
 * Choosing an item closes it.
 */
export function NavigationDrawer({
  open,
  onClose,
  headline,
  className,
  children,
  ref,
  ...props
}: NavigationDrawerProps) {
  const dialog = useModalDialog(open, onClose, ref);

  return (
    <dialog
      {...props}
      {...dialog}
      className={className ? `${styles.drawer} ${className}` : styles.drawer}
    >
      <DrawerContext.Provider value={{ close: onClose }}>
        <nav
          className={styles.sheet}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
        >
          {headline !== undefined && (
            <div className={styles.headline}>{headline}</div>
          )}
          {children}
        </nav>
      </DrawerContext.Provider>
    </dialog>
  );
}

/** What `render` receives: spread it on the router's link component. */
export type NavigationDrawerItemRenderProps = {
  className: string;
  "aria-current": "page" | undefined;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
};

export type NavigationDrawerItemProps = Omit<
  ComponentProps<"a">,
  "children"
> & {
  /** The destination's icon (ADR-005). */
  icon?: ReactNode;
  /** Shown instead of `icon` on the current destination. */
  selectedIcon?: ReactNode;
  /** The visible name of the destination. */
  label: ReactNode;
  /** Trailing text, such as an unread count. */
  badge?: ReactNode;
  /** The current destination: secondary-container and aria-current="page". */
  selected?: boolean;
  /**
   * Renders the item through a router's link instead of an `<a>`, such as
   * `(props) => <Link to="/about" {...props} />`.
   */
  render?: (props: NavigationDrawerItemRenderProps) => ReactElement;
};

/**
 * A destination in a NavigationDrawer: a 56px row with an icon, a label
 * and an optional badge. A plain link by default, or any router link
 * through `render`.
 */
export function NavigationDrawerItem({
  icon,
  selectedIcon,
  label,
  badge,
  selected = false,
  render,
  className,
  onClick,
  ...props
}: NavigationDrawerItemProps) {
  const { close } = useContext(DrawerContext);
  const itemProps: NavigationDrawerItemRenderProps = {
    className: [styles.item, selected && styles.selected, className]
      .filter(Boolean)
      .join(" "),
    "aria-current": selected ? "page" : undefined,
    onClick: (event) => {
      onClick?.(event);
      if (!event.defaultPrevented) close();
    },
    children: (
      <>
        <Ripple />
        {icon !== undefined && (
          <IconSlot className={styles.icon}>
            {selected && selectedIcon !== undefined ? selectedIcon : icon}
          </IconSlot>
        )}
        <span className={styles.label}>{label}</span>
        {/* A space so the accessible name reads "Inbox 24", not "Inbox24";
            whitespace takes no room in the flex row */}
        {badge !== undefined && " "}
        {badge !== undefined && <span className={styles.badge}>{badge}</span>}
      </>
    ),
  };

  return render ? render(itemProps) : <a {...props} {...itemProps} />;
}
