import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchBar } from "./SearchBar";

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  args: { "aria-label": "Search", placeholder: "Search components" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 480, maxInlineSize: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Type, clear with the button or Escape; Escape again leaves the field. */
export const Default: Story = {};

export const WithQuery: Story = { args: { defaultValue: "Button" } };

/** While the field has focus the bar rises one elevation level. */
export const Focused: Story = { args: { autoFocus: true } };

export const WithAvatar: Story = {
  args: {
    trailing: (
      <span
        aria-hidden="true"
        style={{
          inlineSize: 30,
          blockSize: 30,
          marginInlineEnd: 9,
          borderRadius: "var(--md-sys-shape-corner-full)",
          background: "var(--md-sys-color-tertiary-container)",
        }}
      />
    ),
  },
};

export const Disabled: Story = { args: { disabled: true } };
