import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { Card, type CardVariant } from "./Card";

// The story args: the non-link card (the union of div and link props is
// too wide for Storybook's arg types)
type Args = ComponentProps<"div"> & { variant?: CardVariant };

const content = (title: string) => (
  <div style={{ padding: 16 }}>
    <div
      style={{
        font: "var(--md-sys-typescale-title-medium-weight) var(--md-sys-typescale-title-medium-size)/var(--md-sys-typescale-title-medium-line-height) var(--md-sys-typescale-title-medium-font)",
      }}
    >
      {title}
    </div>
    <div
      style={{
        marginBlockStart: 4,
        color: "var(--md-sys-color-on-surface-variant)",
        font: "var(--md-sys-typescale-body-medium-weight) var(--md-sys-typescale-body-medium-size)/var(--md-sys-typescale-body-medium-line-height) var(--md-sys-typescale-body-medium-font)",
      }}
    >
      Transactions this month
    </div>
  </div>
);

const meta = {
  title: "Components/Card",
  component: Card,
  args: { variant: "elevated", children: content("Elevated") },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Elevated: Story = {};

export const Filled: Story = {
  args: { variant: "filled", children: content("Filled") },
};

export const Outlined: Story = {
  args: { variant: "outlined", children: content("Outlined") },
};

/** With `href` the whole card is a link: hover, focus and press states. */
export const Link: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      {(["elevated", "filled", "outlined"] as const).map((variant) => (
        <Card key={variant} variant={variant} href="#report">
          {content(`Open the ${variant} report`)}
        </Card>
      ))}
    </div>
  ),
};
