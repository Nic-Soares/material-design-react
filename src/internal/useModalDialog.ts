import {
  type MouseEvent,
  type PointerEvent,
  type Ref,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

/**
 * Drives a native `<dialog>` as a modal from an `open` prop. The browser
 * traps focus, makes the page inert and returns focus on close; this adds
 * the controlled state: Escape and a click on the backdrop ask `onClose`,
 * and the page doesn't scroll behind the dialog.
 */
export function useModalDialog(
  open: boolean,
  onClose: () => void,
  forwardedRef?: Ref<HTMLDialogElement>,
) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const openRef = useRef(open);
  openRef.current = open;
  const pressedBackdrop = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const ref = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  return {
    ref,
    // Escape: stay open until the owner closes it
    onCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      onClose();
    },
    // Closed by the browser anyway (a repeated Escape, a form): sync up
    onClose: () => {
      if (openRef.current) onClose();
    },
    // The backdrop is the dialog element itself; content fills the rest.
    // Pressed and released there, so a drag out of a field doesn't close.
    onPointerDown: (event: PointerEvent<HTMLDialogElement>) => {
      pressedBackdrop.current = event.target === event.currentTarget;
    },
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      if (pressedBackdrop.current && event.target === event.currentTarget) {
        onClose();
      }
      pressedBackdrop.current = false;
    },
  };
}
