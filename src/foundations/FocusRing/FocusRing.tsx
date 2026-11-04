import styles from "./FocusRing.module.css";

/**
 * The M3 focus indicator, for keyboard focus only. Place it inside a
 * focusable element with `position: relative` (and no `overflow: hidden` on
 * that element: the ring sits outside it).
 *
 * The ring follows `--md-focus-ring-shape`, which the component sets to its
 * own corner radius (full by default), plus `--md-focus-ring-color`,
 * `-width`, `-active-width`, `-outward-offset` and `-duration`.
 */
export function FocusRing() {
  return <span className={styles.ring} aria-hidden="true" />;
}
