import styles from "./StateLayer.module.css";

/**
 * The M3 hover and focus states. Place it inside an interactive element with
 * `position: relative`; it fills the element, follows its corners, and shows
 * on the element's `:hover` and `:focus-visible`. Not shown while the element
 * is disabled.
 *
 * Color and opacities follow `--md-state-layer-color` (the content color by
 * default), `--md-state-layer-hover-opacity` and
 * `--md-state-layer-focus-opacity` (the M3 state opacities).
 */
export function StateLayer() {
  return <span className={styles.layer} aria-hidden="true" />;
}
