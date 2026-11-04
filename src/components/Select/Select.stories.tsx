import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const options = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "q", label: "This quarter" },
  { value: "y", label: "This year" },
  { value: "all", label: "All time", disabled: true },
];

const meta = {
  title: "Components/Select",
  component: Select,
  args: { label: "Period", options, variant: "filled" },
  decorators: [
    (Story) => (
      <div style={{ minBlockSize: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filled: Story = {};

export const Outlined: Story = { args: { variant: "outlined" } };

export const WithValue: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Select
        {...args}
        defaultValue="30d"
        supportingText="Applies to every chart"
      />
      <Select
        {...args}
        variant="outlined"
        defaultValue="30d"
        supportingText="Applies to every chart"
      />
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Select {...args} error required supportingText="Choose a period" />
      <Select
        {...args}
        variant="outlined"
        error
        required
        supportingText="Choose a period"
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <Select {...args} disabled defaultValue="7d" />
      <Select {...args} variant="outlined" disabled defaultValue="7d" />
    </div>
  ),
};

/** Opened once rendered: the chosen option in secondary-container. */
export const Open: Story = {
  args: { defaultValue: "30d" },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>("[role=combobox]")?.click();
  },
};
