import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../IconButton/IconButton";
import { TopAppBar } from "./TopAppBar";

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d={path} />
  </svg>
);
const menu = icon("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z");
const back = icon(
  "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
);
const search = icon(
  "M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
);
const more = icon(
  "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
);

const meta = {
  title: "Components/TopAppBar",
  component: TopAppBar,
  parameters: { layout: "fullscreen" },
  args: {
    leading: <IconButton aria-label="Open navigation" icon={menu} />,
    title: "Inbox",
    trailing: (
      <>
        <IconButton aria-label="Search" icon={search} />
        <IconButton aria-label="More options" icon={more} />
      </>
    ),
    scrolled: false,
  },
} satisfies Meta<typeof TopAppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Small: Story = {};

export const CenterAligned: Story = {
  args: {
    variant: "center",
    leading: <IconButton aria-label="Back" icon={back} />,
    title: "Settings",
    trailing: undefined,
  },
};

export const TitleOnly: Story = {
  args: { leading: undefined, trailing: undefined },
};

/** Content under the bar: the container turns surface-container. */
export const Scrolled: Story = { args: { scrolled: true } };

/** Without `scrolled`, the bar follows the window: scroll the frame. */
export const FollowsScroll: Story = {
  args: { scrolled: undefined },
  render: (args) => (
    <>
      <TopAppBar {...args} style={{ position: "sticky", top: 0 }} />
      <div style={{ blockSize: 1200, padding: 16 }}>Scroll down</div>
    </>
  ),
};
