import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Button } from "../Button/Button";
import { Dialog, type DialogProps } from "./Dialog";

function Example(props: Partial<DialogProps>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        headline="Delete the report?"
        actions={
          <>
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="text">Delete</Button>
          </>
        }
        {...props}
      >
        It can't be restored.
      </Dialog>
    </>
  );
}

const dialog = () => screen.getByRole("dialog", { hidden: true });

describe("Dialog", () => {
  it("opens as a modal named by its headline, described by its body", async () => {
    render(<Example />);
    expect(dialog()).not.toHaveAttribute("open");

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(dialog()).toHaveAttribute("open");
    expect(
      screen.getByRole("dialog", { name: "Delete the report?" }),
    ).toHaveAccessibleDescription("It can't be restored.");
    await expectNoA11yViolations(dialog(), {
      rules: { region: { enabled: false } },
    });
  });

  it("closes from its own action", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(dialog()).not.toHaveAttribute("open");
  });

  it("asks to close on Escape, staying open until told", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} headline="Title">
        Body
      </Dialog>,
    );
    const event = new Event("cancel", { cancelable: true });
    dialog().dispatchEvent(event);

    expect(onClose).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
    expect(dialog()).toHaveAttribute("open");
  });

  it("asks to close on a click on the scrim, not inside", () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose} headline="Title">
        Body
      </Dialog>,
    );

    fireEvent.pointerDown(screen.getByText("Body"));
    fireEvent.click(screen.getByText("Body"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(dialog());
    fireEvent.click(dialog());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("locks the page scroll while open", () => {
    const { rerender } = render(
      <Dialog open onClose={() => {}} headline="Title" />,
    );
    expect(document.documentElement.style.overflow).toBe("hidden");

    rerender(<Dialog open={false} onClose={() => {}} headline="Title" />);
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("centers the headline under an icon", () => {
    render(<Dialog open onClose={() => {}} headline="Title" icon="!" />);
    expect(screen.getByRole("heading", { name: "Title" })).toHaveAttribute(
      "data-centered",
    );
  });

  it("full-screen: a header with a named close button", async () => {
    const onClose = vi.fn();
    render(
      <Dialog
        open
        fullScreen
        onClose={onClose}
        headline="New filter"
        closeLabel="Discard"
        actions={<Button variant="text">Save</Button>}
      >
        Fields
      </Dialog>,
    );

    expect(screen.getByRole("dialog", { name: "New filter" })).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Discard" }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});
