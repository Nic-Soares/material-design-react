import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import styles from "./TopAppBar.module.css";

export type TopAppBarVariant = "small" | "center";

export interface TopAppBarProps
  extends Omit<ComponentProps<"header">, "title"> {
  /** Usually a navigation icon button (menu or back). */
  leading?: ReactNode;
  /**
   * The page title, set in Title Large. Pass a heading element (such as
   * `<h1>`) when the title is the page's heading.
   */
  title?: ReactNode;
  /** Up to three action icon buttons, or an avatar. */
  trailing?: ReactNode;
  /** `"small"` (default) starts the title after the leading slot; `"center"` centers it. */
  variant?: TopAppBarVariant;
  /**
   * Whether content scrolls under the bar, which then takes the
   * surface-container color. Leave it out to follow the window's scroll.
   */
  scrolled?: boolean;
}

/**
 * The M3 top app bar: 64px with leading, title and trailing slots, and the
 * on-scroll container color. It renders a `<header>` and leaves its
 * placement (sticky, fixed) to the page.
 */
export function TopAppBar({
  leading,
  title,
  trailing,
  variant = "small",
  scrolled,
  className,
  ...props
}: TopAppBarProps) {
  const windowScrolled = useWindowScrolled(scrolled === undefined);
  const isScrolled = scrolled ?? windowScrolled;
  const center = variant === "center";

  return (
    <header
      {...props}
      data-scrolled={isScrolled || undefined}
      className={[styles.bar, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
    >
      {(leading !== undefined || center) && (
        <div className={styles.leading}>{leading}</div>
      )}
      <div className={styles.title}>{title}</div>
      {(trailing !== undefined || center) && (
        <div className={styles.trailing}>{trailing}</div>
      )}
    </header>
  );
}

// True once the window leaves the top, while `enabled`
function useWindowScrolled(enabled: boolean) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const update = () => setScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [enabled]);

  return scrolled;
}
