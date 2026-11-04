import type { ComponentProps } from "react";
import styles from "./Divider.module.css";

export type DividerInset = "none" | "start" | "middle";

export interface DividerProps extends ComponentProps<"hr"> {
  /**
   * `"none"` (default) runs edge to edge; `"start"` leaves 16px at the
   * start, as under list items with an icon; `"middle"` 16px at both ends.
   */
  inset?: DividerInset;
  /** Defaults to `"horizontal"`. A vertical one stretches with its row. */
  orientation?: "horizontal" | "vertical";
}

/** The M3 divider: a 1px outline-variant line that groups content. */
export function Divider({
  inset = "none",
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <hr
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      {...props}
      className={[styles.divider, styles[orientation], styles[inset], className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
