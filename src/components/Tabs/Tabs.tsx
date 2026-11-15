import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FocusRing } from "../../foundations/FocusRing/FocusRing";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import { useControllableState } from "../../internal/useControllableState";
import styles from "./Tabs.module.css";

export type TabsVariant = "primary" | "secondary" | "bar";
export type TabsBarSize = "small" | "medium" | "large" | "responsive";

type TabsState = {
  value: string;
  select: (value: string) => void;
  variant: TabsVariant;
  size: TabsBarSize;
  id: (part: "tab" | "panel", value: string) => string;
};

const TabsContext = createContext<TabsState | null>(null);

// True inside the bar's selection pill, a decorative copy of the tabs
const PillContext = createContext(false);

function useTabs(component: string) {
  const state = useContext(TabsContext);
  if (!state) throw new Error(`${component} must be inside <Tabs>`);
  return state;
}

export interface TabsProps
  extends Omit<ComponentProps<"div">, "defaultValue" | "onChange"> {
  /** The selected tab's value (controlled). */
  value?: string;
  /** The tab selected at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the value of the tab the user selects. */
  onValueChange?: (value: string) => void;
  /**
   * `"primary"` (default) for the top level of content, under a top app
   * bar; `"secondary"` within a content area; `"bar"` for the portfolio's
   * Tab Bar, a row of pill tabs with a selection pill that slides.
   */
  variant?: TabsVariant;
  /**
   * The bar's size: small (48px), medium (56px) or large (96px).
   * `"responsive"` (default) steps with the window: small when compact,
   * medium when medium or expanded, large from large up.
   */
  size?: TabsBarSize;
}

/**
 * M3 tabs: a TabList of Tabs and one TabPanel per tab, matched by `value`.
 * Selection follows focus: arrow keys, Home and End move between tabs and
 * show their panel.
 *
 * The `bar` variant isn't an M3 tab style: it is the portfolio's Tab Bar
 * (Figma "Tab Bar", node 1329-368 of the portfolio's file), extracted from
 * its TabbedNavigation with the same roles and keyboard as the M3 tabs. It
 * keeps the bar's look and motion (a surface-variant pill, tabs sharing its
 * width, a primary selection pill that slides between them) and its
 * `sticky` mode; it leaves the app's parts behind: the 2-to-5 tab limit and
 * its placeholders, toggling tabs, the other button styles (only the
 * Figma's text style is used), and the page wrapper around the bar.
 */
export function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  variant = "primary",
  size = "responsive",
  children,
  ...props
}: TabsProps) {
  const [current, select] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const base = useId();
  const id = (part: "tab" | "panel", tab: string) =>
    `${base}-${part}-${tab.replace(/\s+/g, "-")}`;

  return (
    <TabsContext.Provider value={{ value: current, select, variant, size, id }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type TabListProps = ComponentProps<"div"> &
  Name & {
    /**
     * Bar only: sticks to the top of the scrolling page (at
     * `--md-tabs-sticky-top`, 0 by default) and, once stuck, shrinks to the
     * small size and rises to elevation 2. It keeps its full height in the
     * page, so the content under it doesn't move.
     */
    sticky?: boolean;
  };

/** The row of Tabs, with the active indicator under the selected one. */
export function TabList({
  className,
  children,
  onKeyDown,
  style,
  sticky = false,
  ...props
}: TabListProps) {
  const { value, select, variant, size } = useTabs("TabList");
  const listRef = useRef<HTMLDivElement>(null);
  const bar = variant === "bar";
  const stuck = useStuck(bar && sticky);

  // Place the indicator under the selected tab (primary: under its
  // content), and follow it when the tabs resize
  // biome-ignore lint/correctness/useExhaustiveDependencies: the selected tab is read from the DOM, so a new value must re-measure
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const tab = list.querySelector<HTMLElement>("[aria-selected=true]");
      if (bar) {
        // The pill is clipped to the selected tab in percent of the bar, so
        // it keeps its place while the bar changes size (sticky)
        const total = list.scrollWidth;
        if (!tab || !total) {
          list.style.setProperty("--_pill-start", "50%");
          list.style.setProperty("--_pill-end", "50%");
          return;
        }
        const start = (tab.offsetLeft / total) * 100;
        const end = 100 - ((tab.offsetLeft + tab.offsetWidth) / total) * 100;
        list.style.setProperty("--_pill-start", `${start}%`);
        list.style.setProperty("--_pill-end", `${end}%`);
        return;
      }
      const target =
        variant === "primary"
          ? tab?.querySelector<HTMLElement>(`.${styles.content}`)
          : tab;
      if (!target) {
        list.style.setProperty("--_indicator-width", "0px");
        return;
      }
      const listRect = list.getBoundingClientRect();
      const rect = target.getBoundingClientRect();
      list.style.setProperty(
        "--_indicator-start",
        `${rect.left - listRect.left + list.scrollLeft}px`,
      );
      list.style.setProperty("--_indicator-width", `${rect.width}px`);
    };
    place();
    // The pill slides only once placed, so it doesn't fly in from the edge
    const frame = requestAnimationFrame(() =>
      list.setAttribute("data-ready", ""),
    );
    if (typeof ResizeObserver === "undefined")
      return () => cancelAnimationFrame(frame);
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [value, variant, bar]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const tabs = [
      ...(listRef.current?.querySelectorAll<HTMLButtonElement>(
        "[role=tab]:not(:disabled)",
      ) ?? []),
    ];
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[
      event.key
    ];
    let next: number | undefined;
    if (step !== undefined) next = (index + step + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    const tab = tabs[next];
    tab?.focus();
    if (tab?.dataset.value !== undefined) select(tab.dataset.value);
  };

  const list = (
    <div
      ref={listRef}
      role="tablist"
      {...props}
      className={[styles.list, styles[variant], bar && styles[size], className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {children}
      {bar ? (
        // The selection pill: a copy of the row in the selected colors,
        // clipped to the selected tab, so a label stays readable while the
        // pill slides across it
        <div className={styles.pill} aria-hidden="true" inert>
          <PillContext.Provider value={true}>{children}</PillContext.Provider>
        </div>
      ) : (
        <span className={styles.indicator} aria-hidden="true" />
      )}
    </div>
  );

  if (!(bar && sticky)) return list;

  return (
    <>
      <span ref={stuck.sentinelRef} className={styles.sentinel} />
      <div
        ref={stuck.hostRef}
        className={[styles.stickyHost, styles[size]].join(" ")}
        data-stuck={stuck.stuck || undefined}
      >
        {list}
      </div>
    </>
  );
}

/**
 * Whether a sticky bar is stuck: once the sentinel above it has passed the
 * line the bar sticks at (its CSS `top`). Measured on scroll and resize, so
 * a `top` that changes with the window moves the line with it.
 */
function useStuck(enabled: boolean) {
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useLayoutEffect(() => {
    const sentinel = sentinelRef.current;
    const host = hostRef.current;
    if (!enabled || !sentinel || !host) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = Number.parseFloat(getComputedStyle(host).top) || 0;
      setStuck(sentinel.getBoundingClientRect().top < line);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled]);

  return { sentinelRef, hostRef, stuck };
}

export interface TabProps
  extends Omit<ComponentProps<"button">, "value" | "children"> {
  /** Matches the TabPanel it shows. */
  value: string;
  /** The tab's label. */
  children?: ReactNode;
  /** An icon (ADR-005), above the label in primary tabs, beside it in secondary. */
  icon?: ReactNode;
}

/** One tab: a label, an icon, or both. */
export function Tab({
  value,
  icon,
  children,
  className,
  onClick,
  ...props
}: TabProps) {
  const { value: current, select, variant, id } = useTabs("Tab");
  const inPill = useContext(PillContext);
  const selected = current === value;
  const classes = [
    styles.tab,
    icon !== undefined && children !== undefined && styles.withIcon,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const content = (
    <span className={styles.content} data-variant={variant}>
      {icon !== undefined && <IconSlot>{icon}</IconSlot>}
      {children !== undefined && (
        <span className={styles.label}>{children}</span>
      )}
    </span>
  );

  // The bar's selection pill shows a decorative copy of each tab
  if (inPill) return <span className={classes}>{content}</span>;

  return (
    <button
      type="button"
      role="tab"
      id={id("tab", value)}
      aria-controls={id("panel", value)}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      {...props}
      className={classes}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) select(value);
      }}
    >
      <StateLayer />
      <Ripple disabled={props.disabled} />
      <FocusRing className={styles.ring} />
      {content}
    </button>
  );
}

export interface TabPanelProps extends ComponentProps<"div"> {
  /** The value of the Tab that shows this panel. */
  value: string;
}

/** The content of one tab, shown while it is selected. */
export function TabPanel({ value, children, ...props }: TabPanelProps) {
  const { value: current, id } = useTabs("TabPanel");
  const selected = current === value;

  return (
    <div
      role="tabpanel"
      id={id("panel", value)}
      aria-labelledby={id("tab", value)}
      hidden={!selected}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: a tab panel takes focus so keyboard users reach content without focusable elements (WAI-ARIA tabs pattern)
      tabIndex={0}
      {...props}
    >
      {selected && children}
    </div>
  );
}
