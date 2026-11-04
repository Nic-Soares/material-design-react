import { type ComponentProps, type ReactNode, useId } from "react";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { useModalDialog } from "../../internal/useModalDialog";
import { IconButton } from "../IconButton/IconButton";
import styles from "./Dialog.module.css";

export interface DialogProps
  extends Omit<ComponentProps<"dialog">, "open" | "onClose"> {
  /** Whether the dialog is shown, as a modal. */
  open: boolean;
  /** Called on Escape, a click on the scrim, or the full-screen close button. */
  onClose: () => void;
  /** The title, which also names the dialog. */
  headline: ReactNode;
  /** An icon above a centered headline (basic dialogs only). */
  icon?: ReactNode;
  /**
   * Buttons, usually text buttons with the confirming one last. Basic
   * dialogs show them at the bottom; full-screen ones in the header, so
   * pass just the confirming one there.
   */
  actions?: ReactNode;
  /** Fills the window, with a close button and the title in a header. */
  fullScreen?: boolean;
  /** The full-screen close button's name; defaults to "Close". */
  closeLabel?: string;
  /** The icon of the full-screen close button; defaults to an ×. */
  closeIcon?: ReactNode;
}

const closeGlyph = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

/**
 * The M3 dialog, basic or full-screen, on a native modal `<dialog>`: focus
 * stays inside and returns on close, the page behind is inert. Named by
 * its headline; pass `role="alertdialog"` for an urgent confirmation.
 */
export function Dialog({
  open,
  onClose,
  headline,
  icon,
  actions,
  fullScreen = false,
  closeLabel = "Close",
  closeIcon = closeGlyph,
  className,
  children,
  ref,
  ...props
}: DialogProps) {
  const dialog = useModalDialog(open, onClose, ref);
  const headlineId = useId();
  const bodyId = useId();

  return (
    <dialog
      aria-labelledby={headlineId}
      aria-describedby={children !== undefined ? bodyId : undefined}
      {...props}
      {...dialog}
      className={[
        styles.dialog,
        fullScreen ? styles.fullScreen : styles.basic,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.container}>
        {fullScreen ? (
          <header className={styles.header}>
            <IconButton
              aria-label={closeLabel}
              icon={closeIcon}
              onClick={onClose}
            />
            <h2 id={headlineId} className={styles.headline}>
              {headline}
            </h2>
            {actions !== undefined && (
              <div className={styles.headerActions}>{actions}</div>
            )}
          </header>
        ) : (
          <>
            {icon !== undefined && (
              <IconSlot className={styles.icon}>{icon}</IconSlot>
            )}
            <h2
              id={headlineId}
              className={styles.headline}
              data-centered={icon !== undefined || undefined}
            >
              {headline}
            </h2>
          </>
        )}
        {children !== undefined && (
          <div id={bodyId} className={styles.body}>
            {children}
          </div>
        )}
        {!fullScreen && actions !== undefined && (
          <div className={styles.actions}>{actions}</div>
        )}
      </div>
    </dialog>
  );
}
