import type { ComponentProps } from "react";
import styles from "./Skeleton.module.css";

export interface SkeletonProps extends ComponentProps<"div"> {
  /** A pill for text, chips and fields; a rectangle for media. */
  shape?: "pill" | "rect";
  /** `high` for most blocks, `highest` to stand out (titles). */
  tone?: "high" | "highest";
}

/**
 * A loading placeholder block, sized with `style` or a class. Decorative:
 * hidden from assistive tech, so pair it with something that announces the
 * loading, such as a LinearProgress.
 */
export function Skeleton({
  shape = "pill",
  tone = "high",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={[styles.skeleton, styles[shape], styles[tone], className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
