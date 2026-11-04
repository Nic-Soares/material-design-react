import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../test/axe";
import { FocusRing } from "./FocusRing/FocusRing";
import { IconSlot } from "./IconSlot/IconSlot";
import { Ripple } from "./Ripple/Ripple";
import { StateLayer } from "./StateLayer/StateLayer";

// A surface built the way components build theirs
function Surface() {
  return (
    <button type="button" style={{ position: "relative" }}>
      <StateLayer />
      <Ripple />
      <FocusRing />
      <IconSlot>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2 2 22h20z" />
        </svg>
      </IconSlot>
      Save
    </button>
  );
}

describe("foundations together", () => {
  it("leave the control's name and role untouched", async () => {
    const { container } = render(<Surface />);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("are all hidden from assistive tech", () => {
    render(<Surface />);
    const button = screen.getByRole("button");

    for (const child of button.querySelectorAll(":scope > span")) {
      expect(child).toHaveAttribute("aria-hidden", "true");
    }
  });
});

describe("IconSlot", () => {
  it("adds the component's own class", () => {
    render(<IconSlot className="leading">★</IconSlot>);

    expect(screen.getByText("★")).toHaveClass("leading");
  });
});
