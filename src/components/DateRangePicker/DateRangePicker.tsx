import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Field, type FieldVariant } from "../../internal/Field/Field";
import { useControllableState } from "../../internal/useControllableState";
import { Button } from "../Button/Button";
import { Dialog } from "../Dialog/Dialog";
import styles from "./DateRangePicker.module.css";
import { isoDate, localeWeekStart } from "./dates";
import { type DateRange, RangeCalendar } from "./RangeCalendar";

export type { DateRange };

export interface DateRangePickerProps {
  /** The field's label, which also names it. */
  label: string;
  /** The chosen range (controlled). */
  value?: DateRange;
  /** The range at first (uncontrolled). */
  defaultValue?: DateRange;
  /** Called with the range when the user confirms it. */
  onValueChange?: (range: DateRange) => void;
  /**
   * `"docked"` (default) opens the calendar under the field, for larger
   * windows; `"modal"` opens it in a dialog, for compact ones.
   */
  variant?: "docked" | "modal";
  /** The field's style; defaults to `"outlined"`. */
  fieldVariant?: FieldVariant;
  /** A BCP 47 locale for names and formats; the browser's by default. */
  locale?: string;
  /** First day of the week, 0 (Sunday) to 6; the locale's by default. */
  weekStartsOn?: number;
  /** The earliest day that can be chosen. */
  min?: Date;
  /** The latest day that can be chosen. */
  max?: Date;
  supportingText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /**
   * Submits the range with a form as `<name>-start` and `<name>-end`
   * (yyyy-mm-dd).
   */
  name?: string;
  /** The modal's title; defaults to "Select dates". */
  headline?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  className?: string;
}

const EMPTY: DateRange = { start: null, end: null };
const GAP = 4;

const calendarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
  </svg>
);

/**
 * The M3 date range picker: a field showing the range that opens a
 * calendar, docked under it or in a modal dialog. The first day chosen
 * starts the range, the second ends it; the range applies on confirm.
 */
export function DateRangePicker({
  label,
  value,
  defaultValue = EMPTY,
  onValueChange,
  variant = "docked",
  fieldVariant = "outlined",
  locale,
  weekStartsOn,
  min,
  max,
  supportingText,
  error = false,
  disabled = false,
  name,
  headline = "Select dates",
  cancelLabel = "Cancel",
  confirmLabel = "OK",
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  className,
}: DateRangePickerProps) {
  const [range, setRange] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(range);
  const base = useId();
  const labelId = `${base}-label`;
  const supportingId = `${base}-supporting`;
  const popupId = `${base}-popup`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const firstDay = weekStartsOn ?? localeWeekStart(locale);

  const format = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const text = (r: DateRange) =>
    r.start && r.end
      ? format.formatRange(r.start, r.end)
      : r.start
        ? `${format.format(r.start)} –`
        : "";

  const show = () => {
    if (disabled) return;
    setDraft(range);
    setOpen(true);
  };
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);
  const confirm = () => {
    if (draft.start && draft.end) setRange(draft);
    close();
  };

  // Docked: under the field, flipped up when there's no room
  useLayoutEffect(() => {
    if (!open || variant !== "docked") return;
    const field = wrapperRef.current?.firstElementChild?.firstElementChild;
    const popup = popupRef.current;
    if (!field || !popup) return;
    const place = () => {
      const rect = field.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = popup;
      const fitsBelow = rect.bottom + GAP + height <= window.innerHeight;
      const up = !fitsBelow && rect.top - GAP - height >= 0;
      setPosition({
        top: up ? rect.top - GAP - height : rect.bottom + GAP,
        left: Math.min(Math.max(8, rect.left), window.innerWidth - width - 8),
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, variant]);

  // Docked: Escape or a click outside cancels
  useEffect(() => {
    if (!open || variant !== "docked") return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        popupRef.current?.contains(target) ||
        wrapperRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, variant]);

  const calendar = (
    <RangeCalendar
      range={draft}
      onRangeChange={setDraft}
      locale={locale}
      weekStartsOn={firstDay}
      min={min}
      max={max}
      previousMonthLabel={previousMonthLabel}
      nextMonthLabel={nextMonthLabel}
      autoFocus
    />
  );
  const complete = draft.start !== null && draft.end !== null;
  const actions = (
    <>
      <Button variant="text" onClick={close}>
        {cancelLabel}
      </Button>
      <Button variant="text" disabled={!complete} onClick={confirm}>
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <div
      ref={wrapperRef}
      className={[styles.picker, className].filter(Boolean).join(" ")}
    >
      <Field
        variant={fieldVariant}
        label={label}
        labelId={labelId}
        populated={range.start !== null}
        active={open}
        error={error}
        disabled={disabled}
        supportingText={supportingText}
        supportingId={supportingId}
        trailing={<IconSlot>{calendarIcon}</IconSlot>}
        className={styles.field}
      >
        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          aria-labelledby={`${labelId} ${base}-value`}
          aria-describedby={
            supportingText !== undefined ? supportingId : undefined
          }
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popupId : undefined}
          aria-invalid={error || undefined}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : show())}
        >
          <span id={`${base}-value`}>{text(range)}</span>
        </button>
      </Field>
      {name !== undefined && (
        <>
          <input
            type="hidden"
            name={`${name}-start`}
            value={isoDate(range.start)}
            disabled={disabled}
          />
          <input
            type="hidden"
            name={`${name}-end`}
            value={isoDate(range.end)}
            disabled={disabled}
          />
        </>
      )}

      {variant === "docked" &&
        open &&
        createPortal(
          <div
            ref={popupRef}
            id={popupId}
            role="dialog"
            aria-labelledby={labelId}
            className={styles.docked}
            style={{ top: position.top, left: position.left }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                close();
              }
            }}
          >
            {calendar}
            <div className={styles.actions}>{actions}</div>
          </div>,
          document.body,
        )}

      {variant === "modal" && (
        <Dialog
          id={popupId}
          open={open}
          onClose={close}
          headline={
            <span className={styles.modalHeader}>
              <span className={styles.modalTitle}>{headline}</span>
              <span className={styles.modalRange}>{text(draft) || "—"}</span>
            </span>
          }
          actions={actions}
          className={styles.modal}
        >
          {open && calendar}
        </Dialog>
      )}
    </div>
  );
}
