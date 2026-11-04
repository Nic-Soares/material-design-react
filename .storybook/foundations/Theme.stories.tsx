import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemePage } from "./ThemePage";

const meta = {
  title: "Foundations/Theme",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Build a color scheme from a source color and copy its CSS. */
export const FromSourceColor: Story = {
  name: "From a source color",
  render: () => <ThemePage />,
};
