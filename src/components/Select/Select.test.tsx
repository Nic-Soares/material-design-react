import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Select, type SelectProps } from "./Select";

const options = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "q", label: "This quarter", disabled: true },
  { value: "y", label: "This year" },
];

const setup = (props: Partial<SelectProps> = {}) =>
  render(<Select label="Period" options={options} {...props} />);
const combobox = () => screen.getByRole("combobox", { name: "Period" });

describe("Select", () => {
  it("is a named, collapsed combobox showing the chosen label", async () => {
    const { container } = setup({
      defaultValue: "30d",
      supportingText: "Applies to every chart",
    });

    expect(combobox()).toHaveAttribute("aria-expanded", "false");
    expect(combobox()).toHaveTextContent("Last 30 days");
    expect(combobox()).toHaveAccessibleDescription("Applies to every chart");
    await expectNoA11yViolations(container);
  });

  it("opens a listbox on click with the chosen option active", async () => {
    setup({ defaultValue: "30d" });
    await userEvent.click(combobox());

    const list = screen.getByRole("listbox", { name: "Period" });
    expect(combobox()).toHaveAttribute("aria-expanded", "true");
    expect(combobox()).toHaveAttribute("aria-controls", list.id);
    const chosen = screen.getByRole("option", { name: "Last 30 days" });
    expect(chosen).toHaveAttribute("aria-selected", "true");
    expect(combobox()).toHaveAttribute("aria-activedescendant", chosen.id);
    await expectNoA11yViolations(list, {
      rules: { region: { enabled: false } },
    });
  });

  it("chooses with a click and closes, keeping focus on the field", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    await userEvent.click(combobox());
    await userEvent.click(screen.getByRole("option", { name: "This year" }));

    expect(onValueChange).toHaveBeenCalledWith("y");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(combobox()).toHaveTextContent("This year");
    expect(combobox()).toHaveFocus();
  });

  it("moves with the keyboard, skipping disabled options, and chooses with Enter", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    combobox().focus();

    await userEvent.keyboard("{ArrowDown}");
    const active = () =>
      document.getElementById(
        combobox().getAttribute("aria-activedescendant") ?? "",
      );
    expect(active()).toHaveTextContent("Last 7 days");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(active()).toHaveTextContent("This year");
    await userEvent.keyboard("{Home}");
    expect(active()).toHaveTextContent("Last 7 days");
    await userEvent.keyboard("t");
    expect(active()).toHaveTextContent("This year");
    await userEvent.keyboard("{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("y");
    expect(combobox()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape without choosing", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange, defaultValue: "7d" });
    combobox().focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Escape}");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(combobox()).toHaveAttribute("aria-expanded", "false");
    expect(combobox()).toHaveTextContent("Last 7 days");
  });

  it("closes on a click outside", async () => {
    setup();
    await userEvent.click(combobox());
    fireEvent.pointerDown(document.body);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ignores input while disabled", async () => {
    setup({ disabled: true });
    await userEvent.click(combobox());

    expect(combobox()).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("submits its value with a form and flags errors", () => {
    const { container } = setup({
      name: "period",
      value: "30d",
      error: true,
      required: true,
    });

    expect(container.querySelector("input[name=period]")).toHaveValue("30d");
    expect(combobox()).toHaveAttribute("aria-invalid", "true");
    expect(combobox()).toHaveAttribute("aria-required", "true");
  });
});
