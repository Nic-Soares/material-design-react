import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fab, type FabAsButtonProps, type FabColor, type FabSize } from "./Fab";

const pencil = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const sizes: FabSize[] = ["small", "regular", "medium", "large"];
const colors: FabColor[] = [
  "primary-container",
  "secondary-container",
  "tertiary-container",
  "primary",
  "secondary",
  "tertiary",
];

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: 24,
  alignItems: "center",
  padding: 8,
} as const;

const meta = {
  title: "Components/Fab",
  component: Fab,
  args: {
    icon: pencil,
    "aria-label": "Compose",
    size: "regular",
    color: "primary-container",
  } as FabAsButtonProps,
  argTypes: {
    size: { control: "inline-radio", options: sizes },
    color: { control: "select", options: colors },
    icon: { control: false },
  },
} satisfies Meta<typeof Fab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/**
 * Small (40px, the M3 baseline; the kit has none), regular (56px), medium
 * (80px) and large (96px).
 */
export const Sizes: Story = {
  render: () => (
    <div style={row}>
      {sizes.map((size) => (
        <Fab
          key={size}
          icon={pencil}
          aria-label={`Compose (${size})`}
          size={size}
        />
      ))}
    </div>
  ),
};

/** The kit's six colors; hover raises the FAB from elevation 3 to 4. */
export const Colors: Story = {
  render: () => (
    <div style={row}>
      {colors.map((color) => (
        <Fab
          key={color}
          icon={pencil}
          aria-label={`Compose (${color})`}
          color={color}
        />
      ))}
    </div>
  ),
};

/** With `label`: named by its label, in the regular, medium and large sizes. */
export const Extended: Story = {
  render: () => (
    <div style={row}>
      {(["regular", "medium", "large"] as const).map((size) => (
        <Fab key={size} icon={pencil} label="Compose" size={size} />
      ))}
    </div>
  ),
};

/** With `href` it renders an `<a>`; disabled, it drops the `href`. */
export const Link: Story = {
  render: () => (
    <div style={row}>
      <Fab href="#new" icon={pencil} label="New project" />
      <Fab href="#new" icon={pencil} label="New project" disabled />
    </div>
  ),
};

/** M3 FABs have no disabled state; a disabled one looks like a disabled button. */
export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <Fab icon={pencil} aria-label="Compose" disabled />
      <Fab icon={pencil} label="Compose" disabled />
    </div>
  ),
};
