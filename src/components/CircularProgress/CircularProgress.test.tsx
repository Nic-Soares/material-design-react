import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { CircularProgress } from "./CircularProgress";

describe("CircularProgress", () => {
  it("is a named determinate progressbar with track and indicator", async () => {
    const { container } = render(
      <CircularProgress aria-label="Uploading" value={0.25} />,
    );
    const bar = screen.getByRole("progressbar", { name: "Uploading" });

    expect(bar).toHaveAttribute("aria-valuenow", "0.25");
    expect(bar).toHaveAttribute("aria-valuemax", "1");
    expect(container.querySelectorAll("circle")).toHaveLength(2);
    await expectNoA11yViolations(container);
  });

  it("draws the indicator over a quarter, less the round caps", () => {
    const { container } = render(
      <CircularProgress aria-label="p" value={0.25} />,
    );
    const [, indicator] = container.querySelectorAll("circle");
    const length = Number.parseFloat(
      (indicator as SVGElement).style.strokeDasharray,
    );

    expect(length).toBeGreaterThan(20);
    expect(length).toBeLessThan(25);
  });

  it("draws the whole track at zero and hides the indicator", () => {
    const { container } = render(<CircularProgress aria-label="p" value={0} />);
    const [track, indicator] = container.querySelectorAll(
      "circle",
    ) as unknown as SVGElement[];

    expect(track?.style.strokeDasharray).toBe("100 0");
    expect(indicator?.style.strokeOpacity).toBe("0");
  });

  it("closes the ring at the end", () => {
    const { container } = render(<CircularProgress aria-label="p" value={1} />);
    const [, indicator] = container.querySelectorAll("circle");

    expect((indicator as SVGElement).style.strokeDasharray).toBe("100 0");
  });

  it("is indeterminate without a value, sized from props", () => {
    const { container } = render(
      <CircularProgress aria-label="Loading" size={48} />,
    );
    const bar = screen.getByRole("progressbar");

    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar.className).toMatch(/indeterminate/);
    expect(bar.style.inlineSize).toBe("48px");
    expect(container.querySelectorAll("circle")).toHaveLength(1);
  });
});
