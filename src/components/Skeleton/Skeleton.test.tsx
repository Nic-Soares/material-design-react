import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("applies shape and tone and forwards props", () => {
    const { container } = render(
      <Skeleton shape="rect" tone="highest" style={{ blockSize: 120 }} />,
    );
    const block = container.firstChild as HTMLElement;

    expect(block.className).toMatch(/rect/);
    expect(block.className).toMatch(/highest/);
    expect(block.style.blockSize).toBe("120px");
  });
});
