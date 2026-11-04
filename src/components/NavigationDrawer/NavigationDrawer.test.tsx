import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { NavigationDrawer, NavigationDrawerItem } from "./NavigationDrawer";

function Example() {
  const [open, setOpen] = useState(true);
  return (
    <NavigationDrawer
      aria-label="Main"
      headline="Analytics"
      open={open}
      onClose={() => setOpen(false)}
    >
      <NavigationDrawerItem href="#home" label="Home" icon="●" selected />
      <NavigationDrawerItem
        label="Reports"
        badge="24"
        icon="●"
        render={(props) => <a data-router="link" href="#reports" {...props} />}
      />
    </NavigationDrawer>
  );
}

describe("NavigationDrawer", () => {
  it("is a modal with a named nav of links, the current one marked", async () => {
    render(<Example />);
    const drawer = screen.getByRole("dialog", { name: "Main" });

    expect(drawer).toHaveAttribute("open");
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    await expectNoA11yViolations(drawer, {
      rules: { region: { enabled: false } },
    });
  });

  it("renders router links and closes when one is chosen", async () => {
    render(<Example />);
    const reports = screen.getByRole("link", { name: "Reports 24" });

    expect(reports).toHaveAttribute("data-router", "link");
    await userEvent.click(reports);
    expect(screen.getByRole("dialog", { hidden: true })).not.toHaveAttribute(
      "open",
    );
  });
});
