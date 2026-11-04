import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../IconButton/IconButton";
import { Tooltip } from "./Tooltip";

const info = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  args: {
    content: "More about this figure",
    children: <IconButton aria-label="Info" icon={info} />,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Hover the button, or Tab to it. */
export const Plain: Story = {};

export const Rich: Story = {
  args: {
    subhead: "Net revenue",
    content:
      "Sales minus refunds and fees, in the period chosen at the top of the dashboard.",
  },
};

/** Focused once rendered, so the tooltip shows without hovering. */
export const Shown: Story = {
  args: {
    subhead: "Net revenue",
    content: "Sales minus refunds and fees.",
  },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector("button")?.focus();
  },
};
