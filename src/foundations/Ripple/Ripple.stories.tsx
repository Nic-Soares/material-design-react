import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Ripple } from "./Ripple";

const meta = {
  title: "Foundations/Ripple",
  component: Ripple,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Ripple>;

export default meta;

type Story = StoryObj<typeof meta>;

// A bare surface to show the ripple alone; components bring their own
const surface: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  display: "grid",
  placeItems: "center",
  border: 0,
  font: "var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) / var(--md-sys-typescale-label-large-line-height) var(--md-sys-typescale-label-large-font)",
  cursor: "pointer",
};

/** Press with the pointer, or focus and press Enter or Space. */
export const OnAButton: Story = {
  render: (args) => (
    <button
      type="button"
      style={{
        ...surface,
        height: 40,
        paddingInline: 24,
        borderRadius: "var(--md-sys-shape-corner-full)",
        background: "var(--md-sys-color-primary)",
        color: "var(--md-sys-color-on-primary)",
      }}
    >
      <Ripple {...args} />
      Press me
    </button>
  ),
};

/** On a large surface the wave grows from where the pointer is. */
export const OnACard: Story = {
  render: (args) => (
    <button
      type="button"
      style={{
        ...surface,
        width: 320,
        height: 180,
        borderRadius: "var(--md-sys-shape-corner-medium)",
        background: "var(--md-sys-color-surface-container-highest)",
        color: "var(--md-sys-color-on-surface)",
      }}
    >
      <Ripple {...args} />
      Press anywhere
    </button>
  ),
};

/** `--md-ripple-pressed-color` changes the wave's color. */
export const CustomColor: Story = {
  render: (args) => (
    <button
      type="button"
      style={{
        ...surface,
        height: 40,
        paddingInline: 24,
        borderRadius: "var(--md-sys-shape-corner-full)",
        background: "var(--md-sys-color-surface-container)",
        color: "var(--md-sys-color-on-surface)",
        ["--md-ripple-pressed-color" as string]: "var(--md-sys-color-tertiary)",
      }}
    >
      <Ripple {...args} />
      Tertiary ripple
    </button>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: OnAButton.render,
};
