import type { ComponentProps } from "react";
import { FocusRing } from "../../foundations/FocusRing/FocusRing";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import styles from "./Card.module.css";

export type CardVariant = "elevated" | "filled" | "outlined";

type Common = {
  /** Defaults to `"elevated"`. */
  variant?: CardVariant;
};

export type CardProps =
  | (Common & ComponentProps<"div"> & { href?: undefined })
  | (Common & ComponentProps<"a"> & { href: string });

/**
 * The M3 card: a container for content about one subject, elevated, filled
 * or outlined, with medium corners. It renders a `<div>`, or with `href`
 * an `<a>` that takes the hover, focus and pressed states (the whole card
 * is the link, so keep other controls out of it). Padding and layout are
 * the content's.
 */
export function Card({ variant = "elevated", className, ...props }: CardProps) {
  const classes = [styles.card, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  if (props.href !== undefined) {
    const { children, ...link } = props as ComponentProps<"a">;
    return (
      <a {...link} className={`${classes} ${styles.interactive}`}>
        <StateLayer />
        <Ripple />
        <FocusRing />
        {children}
      </a>
    );
  }

  return <div {...(props as ComponentProps<"div">)} className={classes} />;
}
