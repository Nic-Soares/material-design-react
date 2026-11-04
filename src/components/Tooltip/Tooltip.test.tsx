import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Tooltip } from "./Tooltip";

afterEach(() => {
  vi.useRealTimers();
});

describe("Tooltip", () => {
  it("shows after the hover delay and describes its child", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Delete the report">
        <button type="button">Delete</button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Delete" });

    fireEvent.pointerEnter(button, { pointerType: "mouse" });
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(500));

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Delete the report");
    expect(button).toHaveAccessibleDescription("Delete the report");

    fireEvent.pointerLeave(button);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(button).not.toHaveAttribute("aria-describedby");
  });

  it("shows at once on keyboard focus and hides on Escape", async () => {
    render(
      <Tooltip content="Search">
        <button type="button" aria-describedby="hint">
          Find
        </button>
      </Tooltip>,
    );
    await userEvent.tab();

    expect(screen.getByRole("tooltip")).toHaveTextContent("Search");
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-describedby",
      expect.stringMatching(/^hint /),
    );
    await expectNoA11yViolations(screen.getByRole("tooltip"), {
      rules: { region: { enabled: false } },
    });

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-describedby",
      "hint",
    );
  });

  it("ignores touch hovers", () => {
    vi.useFakeTimers();
    render(
      <Tooltip content="Tip">
        <button type="button">B</button>
      </Tooltip>,
    );
    fireEvent.pointerEnter(screen.getByRole("button"), {
      pointerType: "touch",
    });
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("is rich with a subhead", async () => {
    render(
      <Tooltip subhead="Net revenue" content="Sales minus refunds and fees.">
        <button type="button">Info</button>
      </Tooltip>,
    );
    await userEvent.tab();
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip.className).toMatch(/rich/);
    expect(tooltip).toHaveTextContent("Net revenue");
  });
});
