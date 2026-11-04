import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConnectedButtonGroup } from "./ConnectedButtonGroup";

const check = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9.6 17.6-5.3-5.3 1.4-1.4 3.9 3.9 8.7-8.7 1.4 1.4z" />
  </svg>
);

const range = [
  { value: "day", label: "Day", selectedIcon: check },
  { value: "week", label: "Week", selectedIcon: check },
  { value: "month", label: "Month", selectedIcon: check },
];

const meta = {
  title: "Components/ConnectedButtonGroup",
  component: ConnectedButtonGroup,
  args: { "aria-label": "Range", options: range, defaultValue: "week" },
} satisfies Meta<typeof ConnectedButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** One segment at a time; selecting one again clears it. */
export const Single: Story = {};

export const Required: Story = { args: { required: true } };

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ["day", "month"],
    "aria-label": "Days",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      {(["xsmall", "small", "medium", "large"] as const).map((size) => (
        <ConnectedButtonGroup key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      {(["tonal", "filled", "outlined", "elevated"] as const).map((variant) => (
        <ConnectedButtonGroup key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};
