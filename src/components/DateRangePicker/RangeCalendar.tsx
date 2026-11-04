import {
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconButton } from "../IconButton/IconButton";
import styles from "./DateRangePicker.module.css";
import { addDays, addMonths, monthWeeks, sameDay } from "./dates";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface RangeCalendarProps {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  locale?: string;
  weekStartsOn: number;
  min?: Date;
  max?: Date;
  previousMonthLabel: string;
  nextMonthLabel: string;
  /** Focus the grid on mount (popups opening). */
  autoFocus?: boolean;
}

const chevron = (path: string) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={path} />
  </svg>
);
const previous = chevron("M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z");
const next = chevron("M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z");

/**
 * One month of days for choosing a range: the first choice starts it, the
 * second ends it (or restarts it when earlier). A WAI-ARIA grid: arrows
 * move by day and week, Home and End to the week's ends, Page Up and Down
 * by month (with Shift, by year), Enter or Space chooses.
 */
export function RangeCalendar({
  range,
  onRangeChange,
  locale,
  weekStartsOn,
  min,
  max,
  previousMonthLabel,
  nextMonthLabel,
  autoFocus = false,
}: RangeCalendarProps) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const [focused, setFocused] = useState(() => range.start ?? today);
  const [hovered, setHovered] = useState<Date | null>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const moved = useRef(autoFocus);
  const captionId = useId();

  const weeks = monthWeeks(focused, weekStartsOn);
  const outOfBounds = (date: Date) =>
    (min !== undefined && date < min) || (max !== undefined && date > max);

  // Move focus to the focused day after keyboard moves (and on open)
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    const cell = () =>
      gridRef.current?.querySelector<HTMLElement>("[tabindex='0']");
    cell()?.focus();
    // In a modal the dialog opens after this effect and moves focus to
    // itself; take it back on the next frame
    if (document.activeElement !== cell()) {
      requestAnimationFrame(() => cell()?.focus());
    }
  });

  const month = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(focused);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "full" });

  const choose = (date: Date) => {
    if (outOfBounds(date)) return;
    const { start, end } = range;
    if (start === null || end !== null || date < start) {
      onRangeChange({ start: date, end: null });
    } else {
      onRangeChange({ start, end: date });
    }
  };

  const focus = (date: Date) => {
    moved.current = true;
    setFocused(date);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const day = (focused.getDay() - weekStartsOn + 7) % 7;
    const target = (() => {
      switch (event.key) {
        case "ArrowLeft":
          return addDays(focused, rtl ? 1 : -1);
        case "ArrowRight":
          return addDays(focused, rtl ? -1 : 1);
        case "ArrowUp":
          return addDays(focused, -7);
        case "ArrowDown":
          return addDays(focused, 7);
        case "Home":
          return addDays(focused, -day);
        case "End":
          return addDays(focused, 6 - day);
        case "PageUp":
          return addMonths(focused, event.shiftKey ? -12 : -1);
        case "PageDown":
          return addMonths(focused, event.shiftKey ? 12 : 1);
        default:
          return undefined;
      }
    })();
    if (target) {
      event.preventDefault();
      focus(target);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(focused);
    }
  };

  // The band runs to the hovered day while choosing the end
  const bandEnd =
    range.end ??
    (range.start !== null && hovered !== null && hovered > range.start
      ? hovered
      : null);

  return (
    <div className={styles.calendar}>
      <div className={styles.monthBar}>
        <span id={captionId} className={styles.month} aria-live="polite">
          {month}
        </span>
        <IconButton
          aria-label={previousMonthLabel}
          icon={previous}
          onClick={() => setFocused(addMonths(focused, -1))}
        />
        <IconButton
          aria-label={nextMonthLabel}
          icon={next}
          onClick={() => setFocused(addMonths(focused, 1))}
        />
      </div>
      <table
        ref={gridRef}
        // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: a table with role grid is the WAI-ARIA date picker pattern
        role="grid"
        aria-labelledby={captionId}
        className={styles.grid}
        onKeyDown={onKeyDown}
        onPointerLeave={() => setHovered(null)}
      >
        <thead>
          <tr>
            {weeks[0]?.map((_, index) => {
              const date = addDays(
                new Date(2023, 0, 1),
                (weekStartsOn + index) % 7,
              );
              return (
                <th
                  key={date.getDay()}
                  scope="col"
                  abbr={weekdayLong.format(date)}
                  className={styles.weekday}
                >
                  {weekday.format(date)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.find(Boolean)?.getTime()}>
              {week.map((date, index) => {
                if (date === null) {
                  // biome-ignore lint/suspicious/noArrayIndexKey: blank cells have no identity but their place
                  return <td key={index} className={styles.blank} />;
                }
                const start = sameDay(date, range.start);
                const end = sameDay(date, range.end);
                const inBand =
                  range.start !== null &&
                  bandEnd !== null &&
                  date > range.start &&
                  date < bandEnd;
                const disabled = outOfBounds(date);
                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: keys are handled by the grid, which moves focus between cells
                  <td
                    key={date.getTime()}
                    // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: grid cells of the WAI-ARIA date picker pattern
                    role="gridcell"
                    aria-label={full.format(date)}
                    aria-selected={start || end || inBand}
                    aria-disabled={disabled || undefined}
                    aria-current={sameDay(date, today) ? "date" : undefined}
                    tabIndex={sameDay(date, focused) ? 0 : -1}
                    data-start={(start && bandEnd !== null) || undefined}
                    data-end={sameDay(date, bandEnd) || undefined}
                    data-band={inBand || undefined}
                    className={styles.day}
                    onClick={() => {
                      setFocused(date);
                      choose(date);
                    }}
                    onPointerEnter={() => setHovered(date)}
                  >
                    <span
                      className={styles.dayCircle}
                      data-chosen={start || end || undefined}
                    >
                      {date.getDate()}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
