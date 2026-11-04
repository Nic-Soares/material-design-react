import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("is a horizontal separator by default", async () => {
    const { container } = render(<Divider />);
    const divider = screen.getByRole("separator");

    expect(divider).not.toHaveAttribute("aria-orientation");
    expect(divider.className).toMatch(/horizontal/);
    await expectNoA11yViolations(container);
  });

  it("can be vertical and inset", () => {
    render(<Divider orientation="vertical" inset="middle" />);
    const divider = screen.getByRole("separator");

    expect(divider).toHaveAttribute("aria-orientation", "vertical");
    expect(divider.className).toMatch(/vertical/);
    expect(divider.className).toMatch(/middle/);
  });
});
