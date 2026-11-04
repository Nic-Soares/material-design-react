import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Card } from "./Card";

describe("Card", () => {
  it("is a plain container by default", async () => {
    const { container } = render(
      <Card id="c">
        <h2>Revenue</h2>
      </Card>,
    );
    const card = container.firstChild as HTMLElement;

    expect(card.tagName).toBe("DIV");
    expect(card).toHaveAttribute("id", "c");
    expect(card.className).toMatch(/elevated/);
    await expectNoA11yViolations(container);
  });

  it("applies the variant", () => {
    const { container } = render(<Card variant="outlined">x</Card>);
    expect((container.firstChild as HTMLElement).className).toMatch(/outlined/);
  });

  it("is a link with href, its content the name", async () => {
    const { container } = render(
      <Card href="/reports/1" variant="filled">
        <h2>Monthly report</h2>
      </Card>,
    );
    const link = screen.getByRole("link", { name: "Monthly report" });

    expect(link).toHaveAttribute("href", "/reports/1");
    expect(link.className).toMatch(/interactive/);
    await expectNoA11yViolations(container);
  });
});
