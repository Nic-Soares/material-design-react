import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Tab, TabList, TabPanel, Tabs, type TabsBarSize } from "./Tabs";

function Example(props: { onValueChange?: (value: string) => void }) {
  return (
    <Tabs defaultValue="overview" {...props}>
      <TabList aria-label="Report">
        <Tab value="overview">Overview</Tab>
        <Tab value="transactions">Transactions</Tab>
        <Tab value="archive" disabled>
          Archive
        </Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="overview">Overview content</TabPanel>
      <TabPanel value="transactions">Transactions content</TabPanel>
      <TabPanel value="archive">Archive content</TabPanel>
      <TabPanel value="settings">Settings content</TabPanel>
    </Tabs>
  );
}

const tab = (name: string) => screen.getByRole("tab", { name });

describe("Tabs", () => {
  it("is a named tablist with linked tabs and panels", async () => {
    const { container } = render(<Example />);

    expect(screen.getByRole("tablist", { name: "Report" })).toBeInTheDocument();
    expect(tab("Overview")).toHaveAttribute("aria-selected", "true");
    expect(tab("Overview")).toHaveAttribute("tabindex", "0");
    expect(tab("Transactions")).toHaveAttribute("tabindex", "-1");
    const panel = screen.getByRole("tabpanel", { name: "Overview" });
    expect(panel).toHaveTextContent("Overview content");
    expect(tab("Overview")).toHaveAttribute("aria-controls", panel.id);
    await expectNoA11yViolations(container);
  });

  it("selects on click and shows only that panel", async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);
    await userEvent.click(tab("Transactions"));

    expect(onValueChange).toHaveBeenCalledWith("transactions");
    expect(tab("Transactions")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(
      "Transactions content",
    );
  });

  it("moves and selects with arrows, Home and End, skipping disabled tabs", async () => {
    render(<Example />);
    await userEvent.click(tab("Overview"));

    await userEvent.keyboard("{ArrowRight}");
    expect(tab("Transactions")).toHaveFocus();
    expect(tab("Transactions")).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{ArrowRight}");
    expect(tab("Settings")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tab("Overview")).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(tab("Settings")).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(tab("Overview")).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(tab("Settings")).toHaveAttribute("aria-selected", "true");
  });

  it("follows a controlled value", () => {
    const { rerender } = render(
      <Tabs value="a">
        <TabList aria-label="t">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
      </Tabs>,
    );
    rerender(
      <Tabs value="b">
        <TabList aria-label="t">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
      </Tabs>,
    );
    expect(tab("B")).toHaveAttribute("aria-selected", "true");
  });

  it("needs a Tabs around its parts", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Tab value="a">A</Tab>)).toThrow(/inside <Tabs>/);
    vi.restoreAllMocks();
  });
});

describe("Tabs bar", () => {
  function Bar(props: { sticky?: boolean; size?: TabsBarSize }) {
    return (
      <Tabs variant="bar" size={props.size} defaultValue="overview">
        <TabList aria-label="Project" sticky={props.sticky}>
          <Tab value="overview">Overview</Tab>
          <Tab value="features">Features</Tab>
          <Tab value="setup">Setup</Tab>
        </TabList>
        <TabPanel value="overview">Overview content</TabPanel>
        <TabPanel value="features">Features content</TabPanel>
        <TabPanel value="setup">Setup content</TabPanel>
      </Tabs>
    );
  }

  it("keeps the tab roles; the selection pill's copy is hidden", async () => {
    const { container } = render(<Bar />);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(tab("Overview")).toHaveAttribute("aria-selected", "true");
    const pill = container.querySelector("[inert]");
    expect(pill).toHaveAttribute("aria-hidden", "true");
    expect(pill).toHaveTextContent("OverviewFeaturesSetup");
    expect(pill?.querySelector("button, [role]")).toBeNull();
    await expectNoA11yViolations(container);
  });

  it("selects with the pointer and the keyboard, showing the panel", async () => {
    render(<Bar />);

    await userEvent.click(tab("Features"));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Features content");

    await userEvent.keyboard("{ArrowRight}");
    expect(tab("Setup")).toHaveFocus();
    expect(tab("Setup")).toHaveAttribute("aria-selected", "true");
  });

  it.each<TabsBarSize>(["small", "medium", "large", "responsive"])(
    "applies the %s size",
    (size) => {
      render(<Bar size={size} />);

      expect(screen.getByRole("tablist").className).toMatch(size);
    },
  );

  it("wraps a sticky bar in a host that reports when it is stuck", async () => {
    const { container } = render(<Bar sticky />);
    const host = screen.getByRole("tablist").parentElement;

    expect(host?.className).toMatch(/stickyHost/);
    expect(host).not.toHaveAttribute("data-stuck");

    // Scrolled past: the sentinel above the bar is above the line it sticks at
    const sentinel = host?.previousElementSibling as HTMLElement;
    sentinel.getBoundingClientRect = () => ({ top: -100 }) as DOMRect;
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    expect(host).toHaveAttribute("data-stuck");
    await expectNoA11yViolations(container);
  });

  it("isn't sticky unless asked, nor in the M3 variants", () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="t" sticky>
          <Tab value="a">A</Tab>
        </TabList>
      </Tabs>,
    );

    expect(
      screen.getByRole("tablist").parentElement?.className ?? "",
    ).not.toMatch(/stickyHost/);
  });
});
