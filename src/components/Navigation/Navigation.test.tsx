import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { NavigationBar, NavigationItem, NavigationRail } from "./Navigation";

const items = (current: string) =>
  ["Home", "Projects", "About"].map((label) => (
    <NavigationItem
      key={label}
      href={`/${label.toLowerCase()}`}
      icon="●"
      selectedIcon="◉"
      label={label}
      selected={label === current}
    />
  ));

describe("NavigationBar", () => {
  it("is a named nav of links, the current one marked", async () => {
    const { container } = render(
      <NavigationBar aria-label="Main">{items("Projects")}</NavigationBar>,
    );

    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    const current = screen.getByRole("link", { name: "Projects" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("href", "/projects");
    expect(current).toHaveTextContent("◉");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
    await expectNoA11yViolations(container);
  });
});

describe("NavigationRail", () => {
  it("renders the header above the items", async () => {
    const { container } = render(
      <NavigationRail
        aria-label="Main"
        header={<button type="button">Menu</button>}
      >
        {items("Home")}
      </NavigationRail>,
    );
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(nav.firstElementChild).toContainElement(
      screen.getByRole("button", { name: "Menu" }),
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
    await expectNoA11yViolations(container);
  });

  it("renders the footer after the items", async () => {
    const { container } = render(
      <NavigationRail
        aria-label="Main"
        footer={
          <>
            <button type="button">Language</button>
            <button type="button">Theme</button>
          </>
        }
      >
        {items("Home")}
      </NavigationRail>,
    );
    const nav = screen.getByRole("navigation", { name: "Main" });
    const footer = nav.lastElementChild;

    expect(footer).toContainElement(
      screen.getByRole("button", { name: "Language" }),
    );
    expect(footer).toContainElement(
      screen.getByRole("button", { name: "Theme" }),
    );
    expect(footer).not.toContainElement(
      screen.getByRole("link", { name: "Home" }),
    );
    await expectNoA11yViolations(container);
  });

  it("renders no footer element without a footer", () => {
    render(<NavigationRail aria-label="Main">{items("Home")}</NavigationRail>);
    const nav = screen.getByRole("navigation", { name: "Main" });

    expect(nav.children).toHaveLength(1);
  });
});

describe("NavigationItem", () => {
  it("renders through a router link with render", () => {
    render(
      <NavigationItem
        icon="●"
        label="Docs"
        selected
        render={(props) => <a data-router="link" href="/docs" {...props} />}
      />,
    );
    const link = screen.getByRole("link", { name: "Docs" });

    expect(link).toHaveAttribute("data-router", "link");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link.className).toMatch(/selected/);
  });
});
