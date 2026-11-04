import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { IconButton } from "../IconButton/IconButton";
import { TopAppBar } from "./TopAppBar";

describe("TopAppBar", () => {
  it("is a banner with its slots", async () => {
    const { container } = render(
      <TopAppBar
        leading={<IconButton aria-label="Open menu" icon="≡" />}
        title={<h1>Inbox</h1>}
        trailing={<IconButton aria-label="Search" icon="⌕" />}
      />,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Inbox" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("follows the window's scroll unless told", () => {
    render(<TopAppBar title="Inbox" />);
    const bar = screen.getByRole("banner");
    expect(bar).not.toHaveAttribute("data-scrolled");

    act(() => {
      window.scrollY = 120;
      fireEvent.scroll(window);
    });
    expect(bar).toHaveAttribute("data-scrolled");

    act(() => {
      window.scrollY = 0;
      fireEvent.scroll(window);
    });
    expect(bar).not.toHaveAttribute("data-scrolled");
  });

  it("takes the scrolled state from props", () => {
    render(<TopAppBar title="Inbox" scrolled />);
    expect(screen.getByRole("banner")).toHaveAttribute("data-scrolled");
  });

  it("keeps both sides for the centered title and forwards props", () => {
    const { container } = render(
      <TopAppBar title="Inbox" variant="center" id="bar" />,
    );
    const bar = screen.getByRole("banner");

    expect(bar).toHaveAttribute("id", "bar");
    expect(bar.className).toMatch(/center/);
    expect(container.querySelectorAll("header > div")).toHaveLength(3);
  });
});
