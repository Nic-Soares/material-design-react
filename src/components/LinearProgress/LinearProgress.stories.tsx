import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinearProgress, type LinearProgressProps } from "./LinearProgress";

// Stories name the bar with aria-label, one side of the naming union
type Args = Omit<LinearProgressProps, "aria-labelledby"> & {
  "aria-label": string;
};

const meta = {
  title: "Components/LinearProgress",
  component: LinearProgress,
  args: { "aria-label": "Progress", value: 0.4 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 360, maxInlineSize: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Indicator, gap, track and the stop dot at the end. */
export const Determinate: Story = {};

export const Thick: Story = { args: { thickness: 8, value: 0.65 } };

/** No value: a bar sweeps along the track. */
export const Indeterminate: Story = { args: { value: undefined } };

export const Steps: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      {[0, 0.1, 0.5, 0.9, 1].map((value) => (
        <LinearProgress key={value} {...args} value={value} />
      ))}
    </div>
  ),
};
