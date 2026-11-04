import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { FocusRing } from "./FocusRing/FocusRing";
import { IconSlot } from "./IconSlot/IconSlot";
import { Ripple } from "./Ripple/Ripple";
import { StateLayer } from "./StateLayer/StateLayer";

const meta = {
  title: "Foundations/Interactive surface",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const star = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.2-.6L12 2 9.2 8.7 2 9.3l5.4 4.7-1.6 7z" />
  </svg>
);

function Surface({
  style,
  children,
  disabled = false,
}: {
  style: CSSProperties;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: 0,
        cursor: "pointer",
        outline: "none",
        font: "var(--md-sys-typescale-label-large-weight) var(--md-sys-typescale-label-large-size) / var(--md-sys-typescale-label-large-line-height) var(--md-sys-typescale-label-large-font)",
        ...style,
      }}
    >
      <StateLayer />
      <Ripple disabled={disabled} />
      <FocusRing />
      {children}
    </button>
  );
}

/**
 * The pieces every interactive component uses: hover and focus (state
 * layer), press (ripple), keyboard focus (focus ring) and an icon slot.
 * Hover, press, and Tab to see the focus ring.
 */
export const Pill: Story = {
  render: () => (
    <Surface
      style={{
        height: 40,
        paddingInline: 16,
        borderRadius: "var(--md-sys-shape-corner-full)",
        background: "var(--md-sys-color-secondary-container)",
        color: "var(--md-sys-color-on-secondary-container)",
        ["--md-icon-size" as string]: "18px",
      }}
    >
      <IconSlot>{star}</IconSlot>
      Favorite
    </Surface>
  ),
};

/** The focus ring follows the component's corners through --md-focus-ring-shape. */
export const RoundedRectangle: Story = {
  render: () => (
    <Surface
      style={{
        height: 96,
        paddingInline: 24,
        borderRadius: "var(--md-sys-shape-corner-medium)",
        background: "var(--md-sys-color-surface-container-highest)",
        color: "var(--md-sys-color-on-surface)",
        ["--md-focus-ring-shape" as string]:
          "var(--md-sys-shape-corner-medium)",
      }}
    >
      A card-like surface
    </Surface>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Surface
      disabled
      style={{
        height: 40,
        paddingInline: 16,
        borderRadius: "var(--md-sys-shape-corner-full)",
        background: "var(--md-sys-color-surface-container)",
        color: "var(--md-sys-color-on-surface)",
        opacity: 0.38,
      }}
    >
      No hover, no ripple
    </Surface>
  ),
};
