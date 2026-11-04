import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Menu, MenuDivider, MenuItem } from "./Menu";

function Example({
  onSort = () => {},
  sort,
}: {
  onSort?: (value: string) => void;
  sort?: string;
}) {
  const anchor = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        ref={anchor}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        Sort
      </button>
      <button type="button">Outside</button>
      <Menu
        aria-label="Sort by"
        anchor={anchor}
        open={open}
        onClose={() => setOpen(false)}
      >
        {["Name", "Date", "Size"].map((value) => (
          <MenuItem
            key={value}
            selected={sort === undefined ? undefined : sort === value}
            onClick={() => onSort(value)}
          >
            {value}
          </MenuItem>
        ))}
        <MenuDivider />
        <MenuItem disabled>Type</MenuItem>
      </Menu>
    </>
  );
}

describe("Menu", () => {
  it("renders nothing while closed", () => {
    render(<Example />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens as a named menu and focuses the first item", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));

    expect(screen.getByRole("menu", { name: "Sort by" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Name" })).toHaveFocus();
    // The portal sits outside the page's landmarks, as in any app shell
    await expectNoA11yViolations(screen.getByRole("menu"), {
      rules: { region: { enabled: false } },
    });
  });

  it("focuses the selected choice on open", async () => {
    render(<Example sort="Date" />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));

    const date = screen.getByRole("menuitemradio", { name: "Date" });
    expect(date).toHaveAttribute("aria-checked", "true");
    expect(date).toHaveFocus();
  });

  it("moves with arrows, Home, End and letters, skipping disabled items", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    const item = (name: string) => screen.getByRole("menuitem", { name });

    await userEvent.keyboard("{ArrowDown}");
    expect(item("Date")).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(item("Size")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(item("Name")).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}");
    expect(item("Size")).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(item("Name")).toHaveFocus();
    await userEvent.keyboard("d");
    expect(item("Date")).toHaveFocus();
  });

  it("chooses an item, closes and returns focus to the anchor", async () => {
    const onSort = vi.fn();
    render(<Example onSort={onSort} />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(onSort).toHaveBeenCalledWith("Date");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort" })).toHaveFocus();
  });

  it("ignores disabled items", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Type" }));

    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("closes on Escape, back on the anchor", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort" })).toHaveFocus();
  });

  it("closes on a click outside", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("button", { name: "Sort" }));
    await userEvent.click(screen.getByRole("button", { name: "Outside" }));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("toggles from the anchor without closing first", async () => {
    render(<Example />);
    const sort = screen.getByRole("button", { name: "Sort" });
    await userEvent.click(sort);
    await userEvent.click(sort);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
