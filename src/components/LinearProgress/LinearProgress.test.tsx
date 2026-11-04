import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { LinearProgress } from "./LinearProgress";

describe("LinearProgress", () => {
  it("is a named determinate progressbar", async () => {
    const { container } = render(
      <LinearProgress aria-label="Uploading" value={0.4} />,
    );
    const bar = screen.getByRole("progressbar", { name: "Uploading" });

    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "1");
    expect(bar).toHaveAttribute("aria-valuenow", "0.4");
    expect(bar.style.getPropertyValue("--_value")).toBe("0.4");
    await expectNoA11yViolations(container);
  });

  it("scales by max and clamps the value", () => {
    render(<LinearProgress aria-label="Steps" value={12} max={10} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-valuenow", "10");
    expect(bar.style.getPropertyValue("--_value")).toBe("1");
  });

  it("is indeterminate without a value", async () => {
    const { container } = render(<LinearProgress aria-label="Loading" />);
    const bar = screen.getByRole("progressbar");

    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar.className).toMatch(/indeterminate/);
    await expectNoA11yViolations(container);
  });

  it("sets the thickness and forwards props", () => {
    render(
      <LinearProgress aria-label="Loading" thickness={8} id="p" value={0} />,
    );
    const bar = screen.getByRole("progressbar");

    expect(bar.style.getPropertyValue("--_thickness")).toBe("8px");
    expect(bar).toHaveAttribute("id", "p");
  });
});
