import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("is a named searchbox", async () => {
    const { container } = render(
      <SearchBar aria-label="Search projects" placeholder="Search" />,
    );

    expect(
      screen.getByRole("searchbox", { name: "Search projects" }),
    ).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("forwards input props and ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchBar ref={ref} aria-label="Search" name="q" />);

    expect(ref.current).toBe(screen.getByRole("searchbox"));
    expect(ref.current).toHaveAttribute("name", "q");
  });

  it("reports the query as the user types", async () => {
    const onValueChange = vi.fn();
    render(<SearchBar aria-label="Search" onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole("searchbox"), "m3");

    expect(onValueChange).toHaveBeenLastCalledWith("m3");
  });

  it("clears with the clear button, keeping focus in the field", async () => {
    const onValueChange = vi.fn();
    render(
      <SearchBar
        aria-label="Search"
        defaultValue="chips"
        clearLabel="Clear"
        onValueChange={onValueChange}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByRole("searchbox")).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(
      screen.queryByRole("button", { name: "Clear" }),
    ).not.toBeInTheDocument();
  });

  it("clears on Escape, then leaves the field", async () => {
    render(<SearchBar aria-label="Search" defaultValue="tabs" />);
    const field = screen.getByRole("searchbox");
    field.focus();

    await userEvent.keyboard("{Escape}");
    expect(field).toHaveValue("");
    expect(field).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    expect(field).not.toHaveFocus();
  });

  it("is accessible when disabled", async () => {
    const { container } = render(
      <SearchBar aria-label="Search" defaultValue="x" disabled />,
    );

    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
