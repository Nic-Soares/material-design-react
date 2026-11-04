import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";

const star = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 17.3 6.2 3.7-1.6-7 5.4-4.7-7.2-.6L12 2 9.2 8.7 2 9.3l5.4 4.7-1.6 7z" />
  </svg>
);

const variants: ButtonVariant[] = [
  "filled",
  "tonal",
  "outlined",
  "text",
  "elevated",
];
const sizes: ButtonSize[] = ["xsmall", "small", "medium", "large", "xlarge"];

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  alignItems: "center",
} as const;

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Label", variant: "filled", size: "small", shape: "round" },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    shape: { control: "inline-radio", options: ["round", "square"] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** The five M3 Expressive sizes, with a leading icon. */
export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {sizes.map((size) => (
        <Button key={size} {...args} size={size} icon={star}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

/** Square buttons rest on smaller corners; both morph when pressed. */
export const Shapes: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} shape="round">
        Round
      </Button>
      <Button {...args} shape="square">
        Square
      </Button>
    </div>
  ),
};

export const IconOnly: Story = {
  args: { children: undefined, icon: star, "aria-label": "Favorite" },
};

/**
 * Toggle buttons (aria-pressed): unselected filled toggles rest on a neutral
 * container; selected ones take the variant's strongest colors and a smaller
 * corner. Text buttons don't toggle.
 */
export const Toggle: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      {[false, true].map((selected) => (
        <div key={String(selected)} style={row}>
          {variants
            .filter((variant) => variant !== "text")
            .map((variant) => (
              <Button
                key={variant}
                {...args}
                variant={variant}
                icon={star}
                defaultSelected={selected}
              >
                {variant}
              </Button>
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
        <Button key={variant} {...args} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
