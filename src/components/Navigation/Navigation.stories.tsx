import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IconButton } from "../IconButton/IconButton";
import { NavigationBar, NavigationItem, NavigationRail } from "./Navigation";

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d={path} />
  </svg>
);
const destinations = [
  {
    label: "Home",
    icon: icon(
      "M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
    ),
    selectedIcon: icon("M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"),
  },
  {
    label: "Projects",
    icon: icon(
      "M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z",
    ),
    selectedIcon: icon(
      "M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z",
    ),
  },
  {
    label: "About",
    icon: icon(
      "M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    ),
    selectedIcon: icon(
      "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    ),
  },
];

// Selects on click instead of navigating, so the story stays put
function Items() {
  const [current, setCurrent] = useState("Home");
  return destinations.map((destination) => (
    <NavigationItem
      key={destination.label}
      href={`#${destination.label.toLowerCase()}`}
      icon={destination.icon}
      selectedIcon={destination.selectedIcon}
      label={destination.label}
      selected={current === destination.label}
      onClick={(event) => {
        event.preventDefault();
        setCurrent(destination.label);
      }}
    />
  ));
}

const meta = {
  title: "Components/Navigation",
  component: NavigationBar,
  parameters: { layout: "fullscreen" },
  args: { "aria-label": "Main" },
} satisfies Meta<typeof NavigationBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Compact and medium windows: place it fixed to the bottom. */
export const Bar: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: 412 }}>
      <NavigationBar {...args}>
        <Items />
      </NavigationBar>
    </div>
  ),
};

/** Medium windows and up, with a menu button in the header. */
export const Rail: Story = {
  render: (args) => (
    <NavigationRail
      {...args}
      style={{ blockSize: 480 }}
      header={
        <IconButton
          aria-label="Open navigation"
          icon={icon("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z")}
        />
      }
    >
      <Items />
    </NavigationRail>
  ),
};

/**
 * Actions that aren't destinations go in the `footer`, pinned to the
 * bottom: here the language and the theme, as two outlined IconButtons.
 */
export const RailWithFooter: Story = {
  render: (args) => (
    <NavigationRail
      {...args}
      style={{ blockSize: 560 }}
      header={
        <IconButton
          aria-label="Open navigation"
          icon={icon("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z")}
        />
      }
      footer={
        <>
          <IconButton
            aria-label="Language"
            variant="outlined"
            icon={icon(
              "M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z",
            )}
          />
          <IconButton
            aria-label="Dark theme"
            variant="outlined"
            icon={icon(
              "M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z",
            )}
          />
        </>
      }
    >
      <Items />
    </NavigationRail>
  ),
};
