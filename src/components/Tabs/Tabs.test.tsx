import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

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
