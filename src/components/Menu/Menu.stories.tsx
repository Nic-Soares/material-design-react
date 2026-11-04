import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useRef, useState } from "react";
import { Button } from "../Button/Button";
import { Menu, MenuDivider, MenuItem, type MenuPlacement } from "./Menu";

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d={path} />
  </svg>
);
const icons = {
  cut: icon(
    "M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z",
  ),
  copy: icon(
    "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z",
  ),
  paste: icon(
    "M19 2h-4.18C14.4.84 13.3 0 12 0S9.6.84 9.18 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z",
  ),
};

function Demo({
  label,
  placement,
  defaultOpen = false,
  children,
}: {
  label: string;
  placement?: MenuPlacement;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button
        ref={anchor}
        variant="outlined"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {label}
      </Button>
      <Menu
        aria-label={label}
        anchor={anchor}
        open={open}
        placement={placement}
        onClose={() => setOpen(false)}
      >
        {children}
      </Menu>
    </>
  );
}

const meta = {
  title: "Components/Menu",
  component: Menu,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

// Stories render their own anchor and state, so the args stay unused
const unused = {
  "aria-label": "Menu",
  open: false,
  onClose: () => {},
  anchor: { current: null },
  children: null,
};

/** Actions with icons and keyboard shortcuts, in groups. */
export const Default: Story = {
  args: unused,
  render: () => (
    <Demo label="Edit" defaultOpen>
      <MenuItem icon={icons.cut} trailing="⌘X">
        Cut
      </MenuItem>
      <MenuItem icon={icons.copy} trailing="⌘C">
        Copy
      </MenuItem>
      <MenuItem icon={icons.paste} trailing="⌘V">
        Paste
      </MenuItem>
      <MenuDivider />
      <MenuItem disabled>Undo</MenuItem>
      <MenuItem>Select all</MenuItem>
    </Demo>
  ),
};

/** A single choice: the selected item is tertiary-container. */
export const SingleChoice: Story = {
  args: unused,
  render: function Render() {
    const [sort, setSort] = useState("Date");
    return (
      <Demo label={`Sort: ${sort}`} defaultOpen>
        {["Name", "Date", "Size", "Type"].map((value) => (
          <MenuItem
            key={value}
            selected={sort === value}
            onClick={() => setSort(value)}
          >
            {value}
          </MenuItem>
        ))}
      </Demo>
    );
  },
};

/** Aligned to the anchor's end and opening upward when there's room. */
export const Placement: Story = {
  args: unused,
  render: () => (
    <div style={{ paddingBlockStart: 240, textAlign: "end" }}>
      <Demo label="More" placement="top-end" defaultOpen>
        <MenuItem>Share</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Delete</MenuItem>
      </Demo>
    </div>
  ),
};

/** Beside the anchor, bottoms aligned: a navigation rail's menu. */
export const SidePlacement: Story = {
  args: unused,
  render: () => (
    <div style={{ paddingBlockStart: 240 }}>
      <Demo label="Language" placement="right-end" defaultOpen>
        <MenuItem selected>English</MenuItem>
        <MenuItem selected={false}>Português</MenuItem>
        <MenuItem selected={false}>Español</MenuItem>
      </Demo>
    </div>
  ),
};
