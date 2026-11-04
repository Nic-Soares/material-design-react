import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IconButton } from "../IconButton/IconButton";
import { NavigationDrawer, NavigationDrawerItem } from "./NavigationDrawer";

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d={path} />
  </svg>
);
const destinations = [
  {
    label: "Overview",
    path: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  },
  {
    label: "Transactions",
    path: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
    badge: "12",
  },
  {
    label: "Reports",
    path: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
  },
];

function Demo() {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState("Overview");
  return (
    <>
      <IconButton
        aria-label="Open navigation"
        icon={icon("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z")}
        onClick={() => setOpen(true)}
      />
      <NavigationDrawer
        aria-label="Main"
        headline="Analytics"
        open={open}
        onClose={() => setOpen(false)}
      >
        {destinations.map((destination) => (
          <NavigationDrawerItem
            key={destination.label}
            href={`#${destination.label.toLowerCase()}`}
            icon={icon(destination.path)}
            label={destination.label}
            badge={destination.badge}
            selected={current === destination.label}
            onClick={(event) => {
              event.preventDefault();
              setCurrent(destination.label);
            }}
          />
        ))}
      </NavigationDrawer>
    </>
  );
}

const meta = {
  title: "Components/NavigationDrawer",
  component: NavigationDrawer,
  args: { "aria-label": "Main", open: false, onClose: () => {} },
} satisfies Meta<typeof NavigationDrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Opens on load; the scrim, Escape or an item closes it. */
export const Modal: Story = { render: () => <Demo /> };
