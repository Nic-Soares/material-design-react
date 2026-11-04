import type { ReactNode } from "react";
import styles from "./IconSlot.module.css";

export interface IconSlotProps {
  /** The icon: an SVG component, a font ligature, anything. */
  children: ReactNode;
  className?: string;
}

/**
 * Holds an icon a component received as a prop (ADR-005). The component
 * sizes it with `--md-icon-size`; the icon inherits the text color.
 * Decorative: the component names itself, so the icon is hidden from
 * assistive tech.
 */
export function IconSlot({ children, className }: IconSlotProps) {
  return (
    <span
      className={className ? `${styles.slot} ${className}` : styles.slot}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
