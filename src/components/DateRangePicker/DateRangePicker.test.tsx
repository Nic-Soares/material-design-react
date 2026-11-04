import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 0, 15, 10));
});

afterEach(() => {
  vi.useRealTimers();
});

const setup = (props: Partial<DateRangePickerProps> = {}) =>
  render(
    <DateRangePicker
      label="Period"
      locale="en-US"
      weekStartsOn={0}
      {...props}
    />,
  );
const field = () => screen.getByRole("button", { name: /^Period/ });
const day = (name: RegExp) => screen.getByRole("gridcell", { name });

describe("DateRangePicker", () => {
  it("is a named field that opens a dialog", async () => {
    const { container } = setup({ supportingText: "MM/DD/YYYY" });

    expect(field()).toHaveAttribute("aria-haspopup", "dialog");
    expect(field()).toHaveAttribute("aria-expanded", "false");
    await expectNoA11yViolations(container);

    await userEvent.click(field());
    const dialog = screen.getByRole("dialog", { name: "Period" });
    expect(field()).toHaveAttribute("aria-expanded", "true");
    expect(
      within(dialog).getByRole("grid", { name: "January 2026" }),
    ).toBeInTheDocument();
    expect(day(/January 15, 2026/)).toHaveAttribute("aria-current", "date");
    expect(day(/January 15, 2026/)).toHaveFocus();
    await expectNoA11yViolations(dialog, {
      rules: { region: { enabled: false } },
    });
  });

  it("picks a start and an end, and applies them on OK", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    await userEvent.click(field());

    const ok = screen.getByRole("button", { name: "OK" });
    expect(ok).toBeDisabled();
    await userEvent.click(day(/January 5, 2026/));
    await userEvent.click(day(/January 9, 2026/));

    expect(day(/January 5, 2026/)).toHaveAttribute("aria-selected", "true");
    expect(day(/January 7, 2026/)).toHaveAttribute("aria-selected", "true");
    expect(day(/January 12, 2026/)).toHaveAttribute("aria-selected", "false");
    await userEvent.click(ok);

    expect(onValueChange).toHaveBeenCalledWith({
      start: new Date(2026, 0, 5),
      end: new Date(2026, 0, 9),
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(field()).toHaveTextContent("Jan 5 – 9, 2026");
    expect(field()).toHaveFocus();
  });

  it("restarts the range when the end comes before the start", async () => {
    setup();
    await userEvent.click(field());
    await userEvent.click(day(/January 10, 2026/));
    await userEvent.click(day(/January 4, 2026/));

    expect(day(/January 4, 2026/)).toHaveAttribute("aria-selected", "true");
    expect(day(/January 10, 2026/)).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("button", { name: "OK" })).toBeDisabled();
  });

  it("moves through the grid with the keyboard and chooses with Enter", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    await userEvent.click(field());

    await userEvent.keyboard("{ArrowRight}");
    expect(day(/January 16, 2026/)).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(day(/January 23, 2026/)).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(day(/January 18, 2026/)).toHaveFocus();
    await userEvent.keyboard("{Enter}{End}{Enter}");
    await userEvent.keyboard("{PageDown}");
    expect(
      screen.getByRole("grid", { name: "February 2026" }),
    ).toBeInTheDocument();
    expect(day(/February 24, 2026/)).toHaveFocus();

    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    expect(onValueChange).toHaveBeenCalledWith({
      start: new Date(2026, 0, 18),
      end: new Date(2026, 0, 24),
    });
  });

  it("keeps the range on Cancel and Escape", async () => {
    const onValueChange = vi.fn();
    setup({
      onValueChange,
      defaultValue: { start: new Date(2026, 0, 1), end: new Date(2026, 0, 3) },
    });
    await userEvent.click(field());
    await userEvent.click(day(/January 20, 2026/));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await userEvent.click(field());
    await userEvent.keyboard("{Escape}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(field()).toHaveTextContent("Jan 1 – 3, 2026");
  });

  it("can't choose days outside min and max", async () => {
    setup({ min: new Date(2026, 0, 10), max: new Date(2026, 0, 20) });
    await userEvent.click(field());
    await userEvent.click(day(/January 5, 2026/));

    expect(day(/January 5, 2026/)).toHaveAttribute("aria-disabled", "true");
    expect(day(/January 5, 2026/)).toHaveAttribute("aria-selected", "false");
  });

  it("navigates months with the buttons", async () => {
    setup();
    await userEvent.click(field());
    await userEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(
      screen.getByRole("grid", { name: "February 2026" }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Previous month" }),
    );
    expect(
      screen.getByRole("grid", { name: "January 2026" }),
    ).toBeInTheDocument();
  });

  it("opens in a modal dialog with the range as headline", async () => {
    setup({ variant: "modal" });
    await userEvent.click(field());
    const dialog = screen.getByRole("dialog", { name: /Select dates/ });

    await userEvent.click(
      within(dialog).getByRole("gridcell", { name: /January 2, 2026/ }),
    );
    await userEvent.click(
      within(dialog).getByRole("gridcell", { name: /January 6, 2026/ }),
    );
    expect(dialog).toHaveTextContent("Jan 2 – 6, 2026");
  });

  it("submits ISO dates with a form", () => {
    const { container } = setup({
      name: "period",
      value: { start: new Date(2026, 0, 5), end: new Date(2026, 0, 9) },
    });

    expect(container.querySelector("input[name=period-start]")).toHaveValue(
      "2026-01-05",
    );
    expect(container.querySelector("input[name=period-end]")).toHaveValue(
      "2026-01-09",
    );
  });
});
