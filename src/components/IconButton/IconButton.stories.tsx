import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ButtonSize } from "../Button/Button";
import {
  IconButton,
  type IconButtonVariant,
  type IconButtonWidth,
} from "./IconButton";

const heart = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      d="M12 20.3 4.6 13a4.8 4.8 0 0 1 6.8-6.8l.6.6.6-.6A4.8 4.8 0 0 1 19.4 13z"
    />
  </svg>
);
const filledHeart = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20.3 4.6 13a4.8 4.8 0 0 1 6.8-6.8l.6.6.6-.6A4.8 4.8 0 0 1 19.4 13z" />
  </svg>
);

const variants: IconButtonVariant[] = [
  "standard",
  "filled",
  "tonal",
  "outlined",
];
const sizes: ButtonSize[] = ["xsmall", "small", "medium", "large", "xlarge"];
const widths: IconButtonWidth[] = ["narrow", "default", "wide"];
const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  alignItems: "center",
} as const;

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  args: { icon: heart, "aria-label": "Favorite", variant: "filled" },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    width: { control: "inline-radio", options: widths },
    shape: { control: "inline-radio", options: ["round", "square"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {variants.map((variant) => (
        <IconButton key={variant} {...args} variant={variant} />
      ))}
    </div>
  ),
};

/** Five sizes × three widths (narrow, default, wide). */
export const SizesAndWidths: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          {widths.map((width) => (
            <IconButton key={width} {...args} size={size} width={width} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Toggles swap to `selectedIcon` and take the selected colors. */
export const Toggle: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {[false, true].map((selected) => (
        <div key={String(selected)} style={row}>
          {variants.map((variant) => (
            <IconButton
              key={variant}
              {...args}
              variant={variant}
              selectedIcon={filledHeart}
              defaultSelected={selected}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      {variants.map((variant) => (
        <IconButton key={variant} {...args} variant={variant} disabled />
      ))}
    </div>
  ),
};
