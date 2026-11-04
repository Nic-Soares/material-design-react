import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ColorTokens,
  ElevationTokens,
  MotionTokens,
  ShapeTokens,
  TypographyTokens,
} from "./TokenPages";

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Color: Story = { render: () => <ColorTokens /> };
export const Typography: Story = { render: () => <TypographyTokens /> };
export const Shape: Story = { render: () => <ShapeTokens /> };
export const Elevation: Story = { render: () => <ElevationTokens /> };
export const Motion: Story = { render: () => <MotionTokens /> };
