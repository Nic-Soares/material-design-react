import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinearProgress } from "../LinearProgress/LinearProgress";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  args: { style: { inlineSize: 240, blockSize: 16 } },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pill: Story = {};

export const Rect: Story = {
  args: { shape: "rect", style: { inlineSize: 240, blockSize: 140 } },
};

/** A card while it loads: the progress bar tells assistive tech. */
export const Card: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 12,
        inlineSize: 320,
        padding: 16,
        borderRadius: "var(--md-sys-shape-corner-medium)",
        background: "var(--md-sys-color-surface-container-low)",
      }}
    >
      <LinearProgress aria-label="Loading project" />
      <Skeleton shape="rect" style={{ blockSize: 160 }} />
      <Skeleton tone="highest" style={{ inlineSize: "60%", blockSize: 20 }} />
      <Skeleton style={{ blockSize: 14 }} />
      <Skeleton style={{ inlineSize: "80%", blockSize: 14 }} />
    </div>
  ),
};
