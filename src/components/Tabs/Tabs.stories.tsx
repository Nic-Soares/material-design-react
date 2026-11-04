import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d={path} />
  </svg>
);
const tabs = [
  {
    value: "overview",
    label: "Overview",
    icon: icon("M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"),
  },
  {
    value: "transactions",
    label: "Transactions",
    icon: icon(
      "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z",
    ),
  },
  {
    value: "reports",
    label: "Reports",
    icon: icon(
      "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z",
    ),
  },
];

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: { defaultValue: "overview", variant: "primary" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 480, maxInlineSize: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const panels = tabs.map((tab) => (
  <TabPanel key={tab.value} value={tab.value} style={{ padding: 16 }}>
    {tab.label} content
  </TabPanel>
));

/** Click or use the arrow keys: the indicator slides to the tab. */
export const Primary: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Report">
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {panels}
    </Tabs>
  ),
};

export const PrimaryWithIcons: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Report">
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} icon={tab.icon}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {panels}
    </Tabs>
  ),
};

export const Secondary: Story = {
  args: { variant: "secondary" },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Report">
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} icon={tab.icon}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {panels}
    </Tabs>
  ),
};
