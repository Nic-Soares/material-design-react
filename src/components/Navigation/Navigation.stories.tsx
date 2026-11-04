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
