/**
 * The open and close motion is derived from Material Web's menu
 * (menu/internal/menu.ts), Copyright 2023 Google LLC,
 * SPDX-License-Identifier: Apache-2.0. Modified: ported to React and Web
 * Animations on plain elements. See THIRD_PARTY_LICENSES.md.
 */
import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { canRipple, Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import { useReducedMotion } from "../../foundations/useReducedMotion/useReducedMotion";
import styles from "./Menu.module.css";

export type MenuPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type MenuProps = Omit<ComponentProps<"div">, "children"> &
  Name & {
    /** Whether the menu is shown. */
    open: boolean;
    /** Called when the menu asks to close: an item chosen, Escape, a click outside. */
    onClose: () => void;
    /** The element the menu opens from, usually the button that opens it. */
    anchor: RefObject<HTMLElement | null>;
    /** Where the menu sits, flipped to the other side when there's no room. */
    placement?: MenuPlacement;
    /** MenuItem and MenuDivider elements. */
    children: ReactNode;
  };

const MenuContext = createContext<{ close: () => void }>({ close: () => {} });

const ITEM_SELECTOR =
  "[role=menuitem], [role=menuitemradio], [role=menuitemcheckbox]";
const GAP = 4;

const EMPHASIZED = "cubic-bezier(0.3, 0, 0, 1)";
const EMPHASIZED_ACCELERATE = "cubic-bezier(0.3, 0, 0.8, 0.15)";

// The surface grows from the anchor while the items fade in one by one
function animateOpen(surface: HTMLElement, items: HTMLElement[], up: boolean) {
  const duration = 500;
  const itemDuration = 250;
  const delay = (duration - itemDuration) / Math.max(1, items.length);
  const height = surface.offsetHeight;
  const ordered = up ? [...items].reverse() : items;
  return [
    surface.animate([{ height: "0px" }, { height: `${height}px` }], {
      duration,
      easing: EMPHASIZED,
    }),
    surface.animate([{ opacity: 0 }, { opacity: 1 }], 50),
    ...ordered.map((item, index) =>
      item.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: itemDuration,
        delay: delay * index,
        fill: "backwards",
      }),
    ),
  ];
}

// The surface shrinks to 35% while the items fade out
function animateClose(surface: HTMLElement, items: HTMLElement[], up: boolean) {
  const duration = 150;
  const height = surface.offsetHeight;
  const delay = (duration - 100) / Math.max(1, items.length);
  const ordered = up ? items : [...items].reverse();
  return [
    surface.animate(
      [{ height: `${height}px` }, { height: `${height * 0.35}px` }],
      { duration, easing: EMPHASIZED_ACCELERATE, fill: "forwards" },
    ),
    surface.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 50,
      delay: duration - 50,
      fill: "forwards",
    }),
    ...ordered.map((item, index) =>
      item.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 50,
        delay: 50 + delay * index,
        fill: "forwards",
      }),
    ),
  ];
}

const enabledItems = (list: HTMLElement | null) =>
  [...(list?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [])].filter(
    (item) => item.getAttribute("aria-disabled") !== "true",
  );

/**
 * An M3 menu: a list of actions or choices that opens from an anchor, in a
 * portal so no container clips it. Focus moves into the menu on open and
 * back to the anchor on Escape; arrows, Home, End and a first letter move
 * between items.
 */
export function Menu({
  open,
  onClose,
  anchor,
  placement = "bottom-start",
  children,
  className,
  style,
  onKeyDown,
  ...props
}: MenuProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [rendered, setRendered] = useState(open);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    up: boolean;
  }>({ top: 0, left: 0, up: false });
  if (open && !rendered) setRendered(true);

  // Place the menu next to the anchor, flipping when it doesn't fit
  const place = useCallback(() => {
    const anchorRect = anchor.current?.getBoundingClientRect();
    const surface = surfaceRef.current;
    if (!anchorRect || !surface) return;
    // scrollHeight: the content's height, steady while the open motion
    // animates the surface's own height
    const { offsetWidth: width, scrollHeight: height } = surface;
    const wantsUp = placement.startsWith("top");
    const fitsBelow = anchorRect.bottom + GAP + height <= window.innerHeight;
    const fitsAbove = anchorRect.top - GAP - height >= 0;
    const up = wantsUp ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove;
    const top = up ? anchorRect.top - GAP - height : anchorRect.bottom + GAP;
    const alignEnd = placement.endsWith("end");
    let left = alignEnd ? anchorRect.right - width : anchorRect.left;
    left = Math.min(Math.max(8, left), window.innerWidth - width - 8);
    setPosition({ top, left, up });
  }, [anchor, placement]);

  useLayoutEffect(() => {
    if (!rendered) return;
    place();
  }, [rendered, place]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  // Open and close motion; unmount once closed
  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    if (reducedMotion || !canRipple()) {
      if (!open) setRendered(false);
      return;
    }
    const items = [...surface.querySelectorAll<HTMLElement>(ITEM_SELECTOR)];
    const animations = (open ? animateOpen : animateClose)(
      surface,
      items,
      position.up,
    );
    if (!open) {
      animations[0]?.finished.then(() => setRendered(false)).catch(() => {});
    }
    return () => {
      for (const animation of animations) animation.cancel();
    };
  }, [open, reducedMotion, position.up]);

  // Focus the chosen item (or the first) on open; close on a click outside
  useEffect(() => {
    if (!open) return;
    const surface = surfaceRef.current;
    const items = enabledItems(surface);
    (
      items.find((item) => item.getAttribute("aria-checked") === "true") ??
      items[0]
    )?.focus();

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (surface?.contains(target) || anchor.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onClose, anchor]);

  const close = useCallback(() => {
    onClose();
    anchor.current?.focus();
  }, [onClose, anchor]);

  if (!rendered || typeof document === "undefined") return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const items = enabledItems(surfaceRef.current);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const moves: Record<string, number> = {
      ArrowDown: (index + 1) % items.length,
      ArrowUp: (index - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    const move = moves[event.key];
    if (move !== undefined) {
      event.preventDefault();
      items[move]?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      onClose();
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      // Typeahead: the next item starting with the typed letter
      const letter = event.key.toLowerCase();
      const next = [
        ...items.slice(index + 1),
        ...items.slice(0, index + 1),
      ].find((item) =>
        item.textContent?.trim().toLowerCase().startsWith(letter),
      );
      next?.focus();
    }
  };

  return createPortal(
    <MenuContext.Provider value={{ close }}>
      <div
        ref={surfaceRef}
        role="menu"
        {...props}
        className={className ? `${styles.menu} ${className}` : styles.menu}
        style={{ ...style, top: position.top, left: position.left }}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </MenuContext.Provider>,
    document.body,
  );
}

export interface MenuItemProps extends ComponentProps<"button"> {
  /** A leading icon (ADR-005). */
  icon?: ReactNode;
  /** Trailing text or icon, such as a keyboard shortcut. */
  trailing?: ReactNode;
  /**
   * Makes the item a single choice among its siblings (menuitemradio),
   * selected or not.
   */
  selected?: boolean;
  /** Keeps the menu open after the item is chosen. */
  keepOpen?: boolean;
}

/** An item in a Menu: an action, or a choice when `selected` is set. */
export function MenuItem({
  icon,
  trailing,
  selected,
  keepOpen = false,
  disabled,
  className,
  children,
  onClick,
  ...props
}: MenuItemProps) {
  const { close } = useContext(MenuContext);
  const choice = selected !== undefined;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(event);
    if (!keepOpen && !event.defaultPrevented) close();
  };

  return (
    <button
      type="button"
      {...(choice
        ? { role: "menuitemradio", "aria-checked": selected }
        : { role: "menuitem" })}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      {...props}
      className={[styles.item, selected && styles.selected, className]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
    >
      <span className={styles.content}>
        <StateLayer />
        <Ripple disabled={disabled} />
        {icon !== undefined && (
          <IconSlot className={styles.icon}>{icon}</IconSlot>
        )}
        <span className={styles.label}>{children}</span>
        {trailing !== undefined && (
          <span className={styles.trailing}>{trailing}</span>
        )}
      </span>
    </button>
  );
}

/** A line between groups of items. */
export function MenuDivider(props: ComponentProps<"hr">) {
  return <hr {...props} className={styles.divider} />;
}
