import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CircularProgress,
  type CircularProgressProps,
} from "./CircularProgress";

// Stories name the indicator with aria-label, one side of the naming union
type Args = Omit<CircularProgressProps, "aria-labelledby"> & {
  "aria-label": string;
};

const meta = {
  title: "Components/CircularProgress",
  component: CircularProgress,
  args: { "aria-label": "Progress", value: 0.4 },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

/** No value: the arc spins alone. */
export const Indeterminate: Story = { args: { value: undefined } };

export const Steps: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24 }}>
      {[0, 0.1, 0.5, 0.9, 1].map((value) => (
        <CircularProgress key={value} {...args} value={value} />
      ))}
    </div>
  ),
};

export const Large: Story = { args: { size: 64, thickness: 6, value: 0.7 } };
