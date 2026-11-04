import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
} from "react";
import { FocusRing } from "../../foundations/FocusRing/FocusRing";
import { IconSlot } from "../../foundations/IconSlot/IconSlot";
import { Ripple } from "../../foundations/Ripple/Ripple";
import { StateLayer } from "../../foundations/StateLayer/StateLayer";
import { useControllableState } from "../../internal/useControllableState";
import styles from "./Tabs.module.css";

export type TabsVariant = "primary" | "secondary";

type TabsState = {
  value: string;
  select: (value: string) => void;
  variant: TabsVariant;
  id: (part: "tab" | "panel", value: string) => string;
};

const TabsContext = createContext<TabsState | null>(null);

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
   * bar; `"secondary"` within a content area.
   */
  variant?: TabsVariant;
}

/**
 * M3 tabs: a TabList of Tabs and one TabPanel per tab, matched by `value`.
 * Selection follows focus: arrow keys, Home and End move between tabs and
 * show their panel.
 */
export function Tabs({
  value,
  defaultValue = "",
  onValueChange,
  variant = "primary",
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
    <TabsContext.Provider value={{ value: current, select, variant, id }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
}

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type TabListProps = ComponentProps<"div"> & Name;

/** The row of Tabs, with the active indicator under the selected one. */
export function TabList({
  className,
  children,
  onKeyDown,
  style,
  ...props
}: TabListProps) {
  const { value, select, variant } = useTabs("TabList");
  const listRef = useRef<HTMLDivElement>(null);

  // Place the indicator under the selected tab (primary: under its
  // content), and follow it when the tabs resize
  // biome-ignore lint/correctness/useExhaustiveDependencies: the selected tab is read from the DOM, so a new value must re-measure
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const place = () => {
      const tab = list.querySelector<HTMLElement>("[aria-selected=true]");
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
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [value, variant]);

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

  return (
    <div
      ref={listRef}
      role="tablist"
      {...props}
      className={[styles.list, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {children}
      <span className={styles.indicator} aria-hidden="true" />
    </div>
  );
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
  const selected = current === value;

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
      className={[
        styles.tab,
        icon !== undefined && children !== undefined && styles.withIcon,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) select(value);
      }}
    >
      <StateLayer />
      <Ripple disabled={props.disabled} />
      <FocusRing />
      <span className={styles.content} data-variant={variant}>
        {icon !== undefined && <IconSlot>{icon}</IconSlot>}
        {children !== undefined && (
          <span className={styles.label}>{children}</span>
        )}
      </span>
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
