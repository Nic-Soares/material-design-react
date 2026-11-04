import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../Button/Button";
import { Dialog, type DialogProps } from "./Dialog";

function Demo({
  trigger,
  ...props
}: Omit<DialogProps, "open" | "onClose"> & { trigger: string }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        {trigger}
      </Button>
      <Dialog {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: { open: false, onClose: () => {}, headline: "Dialog" },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Opens on load; Escape, the scrim or an action closes it. */
export const Basic: Story = {
  render: () => (
    <Demo
      trigger="Delete report"
      headline="Delete the report?"
      actions={<Button variant="text">Delete</Button>}
    >
      The report and its filters will be removed. This can't be undone.
    </Demo>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Demo
      trigger="Reset"
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
      }
      headline="Reset the dashboard?"
      actions={
        <>
          <Button variant="text">Cancel</Button>
          <Button variant="text">Reset</Button>
        </>
      }
    >
      Every chart goes back to its default period and filters.
    </Demo>
  ),
};

/** Fills the window, for a task with many fields on compact windows. */
export const FullScreen: Story = {
  render: () => (
    <Demo
      trigger="New filter"
      fullScreen
      headline="New filter"
      actions={<Button variant="text">Save</Button>}
    >
      The form goes here.
    </Demo>
  ),
};
