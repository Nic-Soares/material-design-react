import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Carousel, CarouselItem, type CarouselLayout } from "./Carousel";

// The kit's placeholder art: three shapes, centered
const art = (
  <svg
    viewBox="0 0 120 120"
    aria-hidden="true"
    style={{
      position: "absolute",
      insetBlockStart: "50%",
      insetInlineStart: "50%",
      inlineSize: 96,
      blockSize: 96,
      translate: "-50% -50%",
      fill: "var(--md-sys-color-on-surface-variant)",
      opacity: 0.2,
    }}
  >
    <path d="M60 8c6 0 10 4 14 11l14 25c5 9-1 18-11 18H43c-10 0-16-9-11-18l14-25c4-7 8-11 14-11z" />
    <path d="m32 66 4 8 9-2-3 9 8 6-9 3 1 9-8-4-6 7-3-9-9 1 5-8-6-7 9-2-1-9z" />
    <rect x="68" y="70" width="40" height="40" rx="10" />
  </svg>
);

const titles = [
  "Benefits analytics",
  "Material Design React",
  "Portfolio",
  "Energy monitor",
  "Design tokens",
  "Color schemes",
];

const caption = (title: string) => (
  <span
    style={{
      font: "var(--md-sys-typescale-title-medium-weight) var(--md-sys-typescale-title-medium-size) / var(--md-sys-typescale-title-medium-line-height) var(--md-sys-typescale-title-medium-font)",
      color: "var(--md-sys-color-on-surface)",
    }}
  >
    {title}
  </span>
);

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  args: {
    "aria-label": "Projects",
    layout: "multi-browse",
    children: null,
  },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: [
        "multi-browse",
        "uncontained",
        "hero",
      ] satisfies CarouselLayout[],
    },
    children: { control: false },
  },
  render: (args) => (
    <div style={{ maxInlineSize: 520 }}>
      <Carousel {...args}>
        {titles.map((title) => (
          <CarouselItem key={title} media={art}>
            {caption(title)}
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  ),
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Scrolls and snaps; items are masked, rounded, as they pass either end
 * (where the browser supports scroll-driven animations).
 */
export const MultiBrowse: Story = {};

/** Scrolls freely; items are cut off at the end edge. */
export const Uncontained: Story = { args: { layout: "uncontained" } };

/**
 * One large item between compressed ones: press a compressed item, or
 * swipe on touch, to bring it to the middle.
 */
export const Hero: Story = {
  args: {
    layout: "hero",
    showLabel: (index: number) => `Show ${titles[index]}`,
  },
};

/** The hero with content, as the portfolio's home page uses it. */
export const HeroWithContent: Story = {
  args: { layout: "hero", style: { blockSize: 320 } },
  render: (args) => (
    <div style={{ maxInlineSize: 720 }}>
      <Carousel {...args} showLabel={(index) => `Show ${titles[index]}`}>
        {titles.map((title, index) => (
          <CarouselItem key={title} media={art}>
            <span style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            {caption(title)}
            <Button
              href="#more"
              shape="square"
              size="medium"
              style={{ marginBlockStart: 8 }}
            >
              More
            </Button>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  ),
};
