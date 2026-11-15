import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
} from "react";
import { useControllableState } from "../../internal/useControllableState";
import styles from "./Carousel.module.css";

export type CarouselLayout = "multi-browse" | "uncontained" | "hero";

type Name = { "aria-label": string } | { "aria-labelledby": string };

export type CarouselProps = Omit<ComponentProps<"section">, "children"> &
  Name & {
    /** Defaults to `"multi-browse"`. */
    layout?: CarouselLayout;
    /** The items: CarouselItems. */
    children: ReactNode;
    /** Hero: the large item (controlled). */
    index?: number;
    /** Hero: the item that starts large (uncontrolled); defaults to 0. */
    defaultIndex?: number;
    /** Hero: called with the new index when another item becomes large. */
    onIndexChange?: (index: number) => void;
    /** Each item's accessible name; defaults to "1 of 5". */
    slideLabel?: (index: number, count: number) => string;
    /** Hero: the name of a compressed item's button; defaults to "Show slide 2". */
    showLabel?: (index: number, count: number) => string;
    /** Announced for the carousel; defaults to "carousel". */
    roleDescription?: string;
    /** Announced for each item; defaults to "slide". */
    slideRoleDescription?: string;
  };

export type CarouselItemProps = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Fills the item, under the content: an image (with `alt=""` when the
   * content says what it shows) or decorative art. Shown on compressed
   * hero items too.
   */
  media?: ReactNode;
  /** Laid over the media, at the bottom; hidden on compressed hero items. */
  children?: ReactNode;
};

/**
 * An item of a Carousel. It renders nothing on its own: the Carousel lays
 * it out as a slide.
 */
export function CarouselItem(_props: CarouselItemProps): ReactNode {
  return null;
}

const SWIPE_THRESHOLD = 48; // px a finger must travel to change item (hero)

const defaultSlideLabel = (index: number, count: number) =>
  `${index + 1} of ${count}`;
const defaultShowLabel = (index: number) => `Show slide ${index + 1}`;

/**
 * The M3 carousel: a row of items in one of three layouts.
 *
 * - `multi-browse`: a row that scrolls and snaps; items keep their width
 *   (`--md-carousel-item-width`) and are masked, with rounded corners, as
 *   they scroll past either end.
 * - `uncontained`: a row that scrolls freely; items keep their width and
 *   are cut off at the end edge.
 * - `hero`: one large item, its neighbours compressed to 56px; pressing a
 *   compressed item, or swiping on touch, brings it to the middle. At either
 *   end the large item takes the missing neighbour's room.
 *
 * It renders a `<section>` (name it) with the APG carousel roles: each item
 * is a group with `aria-roledescription="slide"`. The scrolling layouts can
 * be scrolled with the keyboard. Give it a block size (220px by default).
 *
 * The hero layout is extracted from the portfolio's ProjectCarousel; the
 * Material 3 Design Kit (Carousel, node 55141-14172) wins where they
 * differ:
 * - items rest on `surface-container-high`, not the portfolio's
 *   `tertiary-container`, and the item's content and scrim are the app's;
 * - the carousel is padded 8px above and below and 16px to the sides, where
 *   the portfolio's filled its parent;
 * - the kit draws multi-browse with fixed 120px and 56px trailing items;
 *   here the trailing items are masked by scroll position (where the
 *   browser supports scroll-driven animations), so their visible width
 *   follows the scroll, not fixed keylines. Without that support they are
 *   cut off at the edge, as in `uncontained`.
 */
export function Carousel({
  layout = "multi-browse",
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  slideLabel = defaultSlideLabel,
  showLabel = defaultShowLabel,
  roleDescription = "carousel",
  slideRoleDescription = "slide",
  className,
  ...props
}: CarouselProps) {
  const items = Children.toArray(children).filter(
    (child): child is ReactElement<CarouselItemProps> => isValidElement(child),
  );
  const count = items.length;

  const sectionProps = {
    ...props,
    "aria-roledescription": roleDescription,
    className: [styles.carousel, styles[layout], className]
      .filter(Boolean)
      .join(" "),
  };

  const slide = (
    item: ReactElement<CarouselItemProps>,
    position: number,
    extra: { className?: string; content: ReactNode },
  ) => {
    const { media, children: _content, className: own, ...rest } = item.props;
    return (
      // The APG carousel pattern: each slide is a role="group"
      // biome-ignore lint/a11y/useSemanticElements: not a form fieldset
      <div
        {...rest}
        key={item.key ?? position}
        role="group"
        aria-roledescription={slideRoleDescription}
        aria-label={slideLabel(position, count)}
        className={[styles.item, extra.className, own]
          .filter(Boolean)
          .join(" ")}
      >
        {media !== undefined && <div className={styles.media}>{media}</div>}
        {extra.content}
      </div>
    );
  };

  if (layout === "hero") {
    return (
      <HeroCarousel
        sectionProps={sectionProps}
        count={count}
        index={index}
        defaultIndex={defaultIndex}
        onIndexChange={onIndexChange}
        render={(current, go) =>
          items.map((item, position) => {
            const offset = position - current;
            if (Math.abs(offset) > 1) return null;
            const isCurrent = offset === 0;
            return slide(item, position, {
              className: isCurrent ? styles.current : styles.peek,
              content: isCurrent ? (
                item.props.children !== undefined && (
                  <div className={styles.content}>{item.props.children}</div>
                )
              ) : (
                // The compressed item is the navigation control
                <button
                  type="button"
                  className={styles.peekButton}
                  aria-label={showLabel(position, count)}
                  onClick={() => go(position)}
                />
              ),
            });
          })
        }
      />
    );
  }

  return (
    <section {...sectionProps}>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region must be reachable by keyboard */}
      <div className={styles.track} tabIndex={0}>
        {items.map((item, position) =>
          slide(item, position, {
            content: item.props.children !== undefined && (
              <div className={styles.content}>{item.props.children}</div>
            ),
          }),
        )}
      </div>
    </section>
  );
}

function HeroCarousel({
  sectionProps,
  count,
  index,
  defaultIndex,
  onIndexChange,
  render,
}: {
  sectionProps: ComponentProps<"section">;
  count: number;
  index: number | undefined;
  defaultIndex: number;
  onIndexChange: ((index: number) => void) | undefined;
  render: (current: number, go: (index: number) => void) => ReactNode;
}) {
  const [current, setCurrent] = useControllableState(
    index,
    defaultIndex,
    onIndexChange,
  );
  const swipeStart = useRef<number | null>(null);

  const last = count - 1;
  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(last, next));
    if (clamped !== current) setCurrent(clamped);
  };

  return (
    <section
      {...sectionProps}
      onPointerDown={(event) => {
        sectionProps.onPointerDown?.(event);
        if (event.pointerType === "touch") swipeStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        sectionProps.onPointerUp?.(event);
        if (swipeStart.current === null) return;
        const distance = event.clientX - swipeStart.current;
        swipeStart.current = null;
        if (distance <= -SWIPE_THRESHOLD) go(current + 1);
        if (distance >= SWIPE_THRESHOLD) go(current - 1);
      }}
    >
      {render(current, go)}
    </section>
  );
}
