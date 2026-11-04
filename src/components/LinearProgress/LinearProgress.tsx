import type { ComponentProps, CSSProperties } from "react";
import styles from "./LinearProgress.module.css";

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type LinearProgressProps = Omit<ComponentProps<"div">, "children"> &
  Name & {
    /**
     * Progress from 0 to `max`, as on `<progress>`. Leave it out for an
     * indeterminate indicator.
     */
    value?: number;
    /** Defaults to 1. */
    max?: number;
    /** Track thickness in px: 4 (default) or 8. */
    thickness?: 4 | 8;
  };

/**
 * The M3 Expressive linear progress indicator: a primary indicator, a gap,
 * and the rest of the track in secondary-container with a stop dot at its
 * end (Material 3 Design Kit). Role progressbar; name it with `aria-label`.
 */
export function LinearProgress({
  value,
  max = 1,
  thickness = 4,
  className,
  style,
  ...props
}: LinearProgressProps) {
  const determinate = value !== undefined;
  const ratio = determinate ? Math.min(1, Math.max(0, value / max)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? max : undefined}
      aria-valuenow={
        determinate ? Math.min(max, Math.max(0, value)) : undefined
      }
      {...props}
      className={[
        styles.progress,
        !determinate && styles.indeterminate,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ...style,
          "--_value": ratio,
          "--_thickness": `${thickness}px`,
        } as CSSProperties
      }
    >
      <span className={styles.indicator} />
      <span className={styles.track} />
      {determinate && <span className={styles.stop} />}
    </div>
  );
}
