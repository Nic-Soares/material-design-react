import {
  type ComponentProps,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "bottom";

export interface TooltipProps
  extends Omit<ComponentProps<"div">, "children" | "content"> {
  /** The element the tooltip describes, usually an icon button. */
  children: ReactElement;
  /** The tooltip text: a short label (plain) or the supporting text (rich). */
  content: ReactNode;
  /** A title over the content, which makes it a rich tooltip. */
  subhead?: ReactNode;
  /** Makes it a rich tooltip even without a subhead. */
  rich?: boolean;
  /** Defaults to `"top"`, flipped when there's no room. */
  placement?: TooltipPlacement;
  /** Hover delay before showing, in ms; defaults to 500. */
  delay?: number;
}

const GAP = 4;

/**
 * An M3 tooltip, plain or rich: shown after a hover delay or at once on
 * keyboard focus, hidden on leave, blur or Escape. It describes its child
 * through aria-describedby, so it carries no actions; use a Dialog or a
 * Menu for interactive content.
 */
export function Tooltip({
  children,
  content,
  subhead,
  rich = subhead !== undefined,
  placement = "top",
  delay = 500,
  className,
  style,
  ...props
}: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const show = useCallback((wait: number) => {
    clearTimeout(timer.current);
    if (wait <= 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), wait);
  }, []);
  const hide = useCallback((wait = 0) => {
    clearTimeout(timer.current);
    if (wait <= 0) setOpen(false);
    else timer.current = setTimeout(() => setOpen(false), wait);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  // The anchor wrapper has display: contents; measure what it wraps. A
  // tooltip lives for seconds, so it follows its anchor every frame: that
  // catches scrolls, resizes and layout shifts alike.
  useLayoutEffect(() => {
    if (!open) return;
    const target = anchorRef.current?.firstElementChild;
    const tooltip = tooltipRef.current;
    if (!target || !tooltip) return;
    let frame = 0;
    let last = "";
    const place = () => {
      const rect = target.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = tooltip;
      const fitsAbove = rect.top - GAP - height >= 0;
      const fitsBelow = rect.bottom + GAP + height <= window.innerHeight;
      const up = placement === "top" ? fitsAbove || !fitsBelow : !fitsBelow;
      const left = rect.left + rect.width / 2 - width / 2;
      const next = {
        top: up ? rect.top - GAP - height : rect.bottom + GAP,
        left: Math.min(Math.max(8, left), window.innerWidth - width - 8),
      };
      const key = `${next.top},${next.left}`;
      if (key !== last) {
        last = key;
        setPosition(next);
      }
      if (typeof requestAnimationFrame === "function") {
        frame = requestAnimationFrame(place);
      }
    };
    place();
    return () => cancelAnimationFrame(frame);
  }, [open, placement]);

  // While shown, the child is described by the tooltip, keeping any
  // description it already had
  useLayoutEffect(() => {
    const target = anchorRef.current?.firstElementChild;
    if (!open || !target) return;
    const previous = target.getAttribute("aria-describedby");
    target.setAttribute(
      "aria-describedby",
      previous ? `${previous} ${id}` : id,
    );
    return () => {
      if (previous === null) target.removeAttribute("aria-describedby");
      else target.setAttribute("aria-describedby", previous);
    };
  }, [open, id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, hide]);

  const onFocus = (event: FocusEvent<HTMLSpanElement>) => {
    // Keyboard focus only: a click shouldn't pop the tooltip up
    const target = event.target as HTMLElement;
    let keyboard = true;
    try {
      keyboard = target.matches(":focus-visible");
    } catch {
      // Engines without :focus-visible
    }
    if (keyboard) show(0);
  };

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: a display: contents wrapper that only listens to its child's bubbling events */}
      <span
        ref={anchorRef}
        className={styles.anchor}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") show(delay);
        }}
        onPointerLeave={() => hide(rich ? 300 : 0)}
        onFocus={onFocus}
        onBlur={() => hide()}
      >
        {children}
      </span>
      {open &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            id={id}
            {...props}
            className={[
              styles.tooltip,
              rich ? styles.rich : styles.plain,
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ ...style, top: position.top, left: position.left }}
            onPointerEnter={() => rich && show(0)}
            onPointerLeave={() => hide(rich ? 300 : 0)}
          >
            {subhead !== undefined && (
              <div className={styles.subhead}>{subhead}</div>
            )}
            <div className={styles.content}>{content}</div>
          </div>,
          document.body,
        )}
    </>
  );
}
