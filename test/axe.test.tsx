import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "./axe";

describe("expectNoA11yViolations", () => {
  it("passes for a button with an accessible name", async () => {
    const { container } = render(<button type="button">Save</button>);

    await expect(expectNoA11yViolations(container)).resolves.toBeUndefined();
  });

  it("fails for a button without an accessible name, naming the rule", async () => {
    const { container } = render(<button type="button" />);

    await expect(expectNoA11yViolations(container)).rejects.toThrow(
      "button-name",
    );
  });
});
