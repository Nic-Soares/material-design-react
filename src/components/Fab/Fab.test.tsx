import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Fab, type FabColor, type FabSize } from "./Fab";

const pencil = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
  </svg>
);

describe("Fab", () => {
  it("renders a native button named by aria-label, its icon hidden", async () => {
    const { container } = render(<Fab icon={pencil} aria-label="Compose" />);
    const fab = screen.getByRole("button", { name: "Compose" });

    expect(fab.tagName).toBe("BUTTON");
    expect(fab).toHaveAttribute("type", "button");
    expect(fab.querySelector("svg")?.closest("[aria-hidden]")).not.toBeNull();
    await expectNoA11yViolations(container);
  });

  it("is named by its label when extended", async () => {
    const { container } = render(<Fab icon={pencil} label="Compose" />);
    const fab = screen.getByRole("button", { name: "Compose" });

    expect(fab.className).toMatch(/extended/);
    await expectNoA11yViolations(container);
  });

  it("forwards native props, className and ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Fab
        ref={ref}
        icon={pencil}
        aria-label="Compose"
        id="compose"
        type="submit"
        className="mine"
      />,
    );
    const fab = screen.getByRole("button");

    expect(ref.current).toBe(fab);
    expect(fab).toHaveAttribute("id", "compose");
    expect(fab).toHaveAttribute("type", "submit");
    expect(fab).toHaveClass("mine");
  });

  it("calls onClick from the mouse and the keyboard", async () => {
    const onClick = vi.fn();
    render(<Fab icon={pencil} aria-label="Compose" onClick={onClick} />);
    const fab = screen.getByRole("button");

    await userEvent.click(fab);
    fab.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("doesn't call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Fab icon={pencil} aria-label="Compose" disabled onClick={onClick} />,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it.each<FabSize>(["small", "regular", "medium", "large"])(
    "applies the %s size",
    (size) => {
      render(<Fab icon={pencil} aria-label="Compose" size={size} />);

      expect(screen.getByRole("button").className).toMatch(size);
    },
  );

  it.each<FabColor>([
    "primary-container",
    "secondary-container",
    "tertiary-container",
    "primary",
    "secondary",
    "tertiary",
  ])("applies the %s color", async (color) => {
    const { container } = render(
      <Fab icon={pencil} label="Compose" color={color} />,
    );

    expect(screen.getByRole("button").className).toMatch(color);
    await expectNoA11yViolations(container);
  });

  it("renders a link with href, forwarding anchor props and ref", async () => {
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(
      <Fab
        ref={ref}
        href="/new"
        target="_blank"
        icon={pencil}
        label="New project"
      />,
    );
    const link = screen.getByRole("link", { name: "New project" });

    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute("href", "/new");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("type");
    await expectNoA11yViolations(container);
  });

  it("drops href and sets aria-disabled on a disabled link", () => {
    render(<Fab href="/new" disabled icon={pencil} label="New project" />);
    const link = screen.getByText("New project").closest("a");

    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });
});
