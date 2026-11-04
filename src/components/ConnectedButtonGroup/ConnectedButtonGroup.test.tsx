import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { ConnectedButtonGroup } from "./ConnectedButtonGroup";

const options = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const pressed = (name: string) =>
  screen.getByRole("button", { name }).getAttribute("aria-pressed");

describe("ConnectedButtonGroup", () => {
  it("is a named group of toggle buttons", async () => {
    const { container } = render(
      <ConnectedButtonGroup aria-label="Range" options={options} />,
    );

    expect(screen.getByRole("group", { name: "Range" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    await expectNoA11yViolations(container);
  });

  it("selects one segment at a time", async () => {
    const onValueChange = vi.fn();
    render(
      <ConnectedButtonGroup
        aria-label="Range"
        options={options}
        defaultValue="day"
        onValueChange={onValueChange}
      />,
    );
    expect(pressed("Day")).toBe("true");

    await userEvent.click(screen.getByRole("button", { name: "Week" }));

    expect(pressed("Day")).toBe("false");
    expect(pressed("Week")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("week");
  });

  it("deselects, unless required", async () => {
    const { rerender } = render(
      <ConnectedButtonGroup
        aria-label="Range"
        options={options}
        defaultValue="day"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Day" }));
    expect(pressed("Day")).toBe("false");

    rerender(
      <ConnectedButtonGroup
        key="required"
        aria-label="Range"
        options={options}
        defaultValue="day"
        required
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Day" }));
    expect(pressed("Day")).toBe("true");
  });

  it("selects many when multiple, in option order", async () => {
    const onValueChange = vi.fn();
    render(
      <ConnectedButtonGroup
        aria-label="Days"
        options={options}
        multiple
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Month" }));
    await userEvent.click(screen.getByRole("button", { name: "Day" }));

    expect(pressed("Day")).toBe("true");
    expect(pressed("Month")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith(["day", "month"]);
  });

  it("follows `value` when controlled", async () => {
    const onValueChange = vi.fn();
    render(
      <ConnectedButtonGroup
        aria-label="Range"
        options={options}
        value="month"
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Day" }));

    expect(pressed("Month")).toBe("true");
    expect(onValueChange).toHaveBeenCalledWith("day");
  });

  it("skips disabled segments", async () => {
    render(
      <ConnectedButtonGroup
        aria-label="Range"
        options={[...options, { value: "year", label: "Year", disabled: true }]}
      />,
    );

    expect(screen.getByRole("button", { name: "Year" })).toBeDisabled();
  });
});
