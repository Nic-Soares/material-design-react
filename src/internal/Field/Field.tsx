import type { ReactNode } from "react";
import styles from "./Field.module.css";

export type FieldVariant = "filled" | "outlined";

export interface FieldProps {
  variant: FieldVariant;
  /** The floating label's text. */
  label: ReactNode;
  /** Its id, for the control's aria-labelledby. */
  labelId: string;
  /** The label sits small at the top (a value is shown). */
  populated: boolean;
  /** Keeps the field in its focused look, as while a popup is open. */
  active?: boolean;
  error?: boolean;
  disabled?: boolean;
  /** Text under the field: a hint, or the error. */
  supportingText?: ReactNode;
  supportingId?: string;
  /** An icon at the end of the field, such as a dropdown arrow. */
  trailing?: ReactNode;
  className?: string;
  /** The control, filling the field. */
  children: ReactNode;
}

/**
 * The M3 text field shell shared by fields that aren't plain inputs
 * (Select, date pickers): filled or outlined container, floating label,
 * active indicator, trailing icon and supporting text. The control inside
 * owns the semantics; this draws the field around it.
 */
export function Field({
  variant,
  label,
  labelId,
  populated,
  active = false,
  error = false,
  disabled = false,
  supportingText,
  supportingId,
  trailing,
  className,
  children,
}: FieldProps) {
  return (
    <div
      className={[styles.field, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
      data-populated={populated || undefined}
      data-active={active || undefined}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
    >
      <div className={styles.container}>
        {variant === "outlined" && (
          <fieldset className={styles.outline} aria-hidden="true">
            <legend className={styles.notch}>
              <span>{label}</span>
            </legend>
          </fieldset>
        )}
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        <div className={styles.control}>{children}</div>
        {trailing !== undefined && (
          <span className={styles.trailing}>{trailing}</span>
        )}
      </div>
      {supportingText !== undefined && (
        <div id={supportingId} className={styles.supporting}>
          {supportingText}
        </div>
      )}
    </div>
  );
}
