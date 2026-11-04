import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Ripple } from "./Ripple";

const mouse = { isPrimary: true, buttons: 1, pointerType: "mouse" };

function renderInButton(disabled = false) {
  const { container } = render(
    <button type="button" style={{ position: "relative" }}>
      <Ripple disabled={disabled} />
      Press
    </button>,
  );
  const button = screen.getByRole("button", { name: "Press" });
  const surface = button.querySelector("span") as HTMLSpanElement;
  const pressed = () => surface.hasAttribute("data-pressed");
  return { container, button, surface, pressed };
}

describe("Ripple", () => {
  it("is hidden from assistive tech", async () => {
    const { container, surface } = renderInButton();

    expect(surface).toHaveAttribute("aria-hidden", "true");
    await expectNoA11yViolations(container);
  });

  it("shows the pressed state from pointer down until the click", () => {
    const { button, pressed } = renderInButton();

    fireEvent.pointerDown(button, mouse);
    expect(pressed()).toBe(true);

    fireEvent.pointerUp(button, { ...mouse, buttons: 0 });
    fireEvent.click(button);
    expect(pressed()).toBe(false);
  });

  it("ripples from a keyboard click", () => {
    const { button, surface } = renderInButton();
    const waves: Node[] = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) waves.push(...record.addedNodes);
    });
    observer.observe(surface, { childList: true });

    fireEvent.click(button);

    return Promise.resolve().then(() => {
      observer.disconnect();
      expect(waves.length).toBe(1);
    });
  });

  it("ignores presses when disabled", () => {
    const { button, pressed } = renderInButton(true);

    fireEvent.pointerDown(button, mouse);

    expect(pressed()).toBe(false);
  });

  it("ignores secondary buttons", () => {
    const { button, pressed } = renderInButton();

    fireEvent.pointerDown(button, { ...mouse, buttons: 2 });

    expect(pressed()).toBe(false);
  });
});
