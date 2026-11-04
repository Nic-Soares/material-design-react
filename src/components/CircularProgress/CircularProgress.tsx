import type { ComponentProps } from "react";
import styles from "./CircularProgress.module.css";

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type CircularProgressProps = Omit<ComponentProps<"div">, "children"> &
  Name & {
    /**
     * Progress from 0 to `max`, as on `<progress>`. Leave it out for an
     * indeterminate indicator.
     */
    value?: number;
    /** Defaults to 1. */
    max?: number;
    /** Diameter in px; defaults to 40. */
    size?: number;
    /** Stroke width in px; defaults to 4. */
    thickness?: number;
  };

const GAP = 4;

/**
 * The M3 Expressive circular progress indicator: a primary arc, a gap, and
 * the rest of the ring in secondary-container (Material 3 Design Kit).
 * Indeterminate, a primary arc spins alone. Role progressbar; name it with
 * `aria-label`.
 */
export function CircularProgress({
  value,
  max = 1,
  size = 40,
  thickness = 4,
  className,
  style,
  ...props
}: CircularProgressProps) {
  const determinate = value !== undefined;
  const ratio = determinate ? Math.min(1, Math.max(0, value / max)) : 0;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arcs in percent of the ring (pathLength 100). Round caps reach half the
  // thickness past each end, so each arc is drawn that much shorter.
  const cap = (thickness / 2 / circumference) * 100;
  const gap = (GAP / circumference) * 100;
  const progress = ratio * 100;
  const arc = (start: number, end: number) => {
    const length = end - start - 2 * cap;
    return length > 0
      ? { strokeDasharray: `${length} 100`, strokeDashoffset: -(start + cap) }
      : { strokeDasharray: "0 100", strokeOpacity: 0 };
  };
  const indicator = !determinate
    ? undefined
    : ratio === 1
      ? { strokeDasharray: "100 0" }
      : arc(0, progress);
  const track =
    ratio === 0 ? { strokeDasharray: "100 0" } : arc(progress + gap, 100 - gap);

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
      style={{ ...style, inlineSize: size, blockSize: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        {determinate && (
          <circle
            className={styles.track}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            pathLength={100}
            strokeWidth={thickness}
            style={track}
          />
        )}
        <circle
          className={styles.indicator}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          pathLength={100}
          strokeWidth={thickness}
          style={indicator}
        />
      </svg>
    </div>
  );
}
