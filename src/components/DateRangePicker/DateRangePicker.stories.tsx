import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateRangePicker } from "./DateRangePicker";

const today = new Date();
const day = (offset: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

const meta = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  args: { label: "Period", locale: "en-US" },
  decorators: [
    (Story) => (
      <div style={{ minBlockSize: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Docked: Story = {
  args: { defaultValue: { start: day(-3), end: day(3) } },
};

/** Opened once rendered: range ends in primary, the band between them. */
export const DockedOpen: Story = {
  args: { defaultValue: { start: day(-3), end: day(3) } },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>("button")?.click();
  },
};

export const Modal: Story = {
  args: {
    variant: "modal",
    defaultValue: { start: day(-3), end: day(3) },
  },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>("button")?.click();
  },
};

export const Filled: Story = {
  args: { fieldVariant: "filled", supportingText: "Applies to every chart" },
};

/** Days outside min and max can't be chosen. */
export const Bounded: Story = {
  args: { min: day(-10), max: day(10) },
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>("button")?.click();
  },
};

export const PortugueseBrazil: Story = {
  args: {
    label: "Período",
    locale: "pt-BR",
    headline: "Selecione as datas",
    cancelLabel: "Cancelar",
    confirmLabel: "OK",
    previousMonthLabel: "Mês anterior",
    nextMonthLabel: "Próximo mês",
    defaultValue: { start: day(-3), end: day(3) },
  },
};
