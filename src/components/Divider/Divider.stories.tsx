import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const row = (text: string) => (
  <div
    style={{ padding: "12px 16px", color: "var(--md-sys-color-on-surface)" }}
  >
    {text}
  </div>
);

const meta = {
  title: "Components/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

const between: Story["decorators"] = [
  (Story) => (
    <div style={{ inlineSize: 320 }}>
      {row("Above")}
      <Story />
      {row("Below")}
    </div>
  ),
];

export const FullWidth: Story = { decorators: between };

export const InsetStart: Story = {
  decorators: between,
  args: { inset: "start" },
};

export const MiddleInset: Story = {
  decorators: between,
  args: { inset: "middle" },
};

export const Vertical: Story = {
  decorators: [
    (Story) => (
      <div style={{ display: "flex", blockSize: 48, alignItems: "center" }}>
        {row("Left")}
        <Story />
        {row("Right")}
      </div>
    ),
  ],
  args: { orientation: "vertical" },
};
