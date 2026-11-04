import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssistChip, FilterChip, InputChip, SuggestionChip } from "./Chip";

const calendar = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 22q-.8 0-1.4-.6T3 20V6q0-.8.6-1.4T5 4h1V2h2v2h8V2h2v2h1q.8 0 1.4.6T21 6v14q0 .8-.6 1.4T19 22zm0-2h14V10H5z" />
  </svg>
);
const arrow = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 15-5-5h10z" />
  </svg>
);
const avatar = (
  <img
    alt=""
    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23b69df8'/%3E%3C/svg%3E"
  />
);

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
} as const;

const meta = {
  title: "Components/Chip",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** Smart or automated actions. */
export const Assist: Story = {
  render: () => (
    <div style={row}>
      <AssistChip icon={calendar}>Add to calendar</AssistChip>
      <AssistChip>Directions</AssistChip>
      <AssistChip icon={calendar} elevated>
        Elevated
      </AssistChip>
      <AssistChip disabled>Disabled</AssistChip>
    </div>
  ),
};

/** Toggles that narrow content; selected ones show a checkmark. */
export const Filter: Story = {
  render: () => (
    <div style={row}>
      <FilterChip>Vegetarian</FilterChip>
      <FilterChip defaultSelected>Vegan</FilterChip>
      <FilterChip trailingIcon={arrow}>Price</FilterChip>
      <FilterChip elevated>Elevated</FilterChip>
      <FilterChip disabled>Disabled</FilterChip>
    </div>
  ),
};

/** Information the user entered, removable. */
export const Input: Story = {
  render: () => (
    <div style={row}>
      <InputChip onRemove={() => {}} removeLabel="Remove Design">
        Design
      </InputChip>
      <InputChip avatar={avatar} onRemove={() => {}} removeLabel="Remove Alice">
        Alice
      </InputChip>
      <InputChip icon={calendar}>Today</InputChip>
      <InputChip selected onClick={() => {}}>
        Selected
      </InputChip>
      <InputChip disabled onRemove={() => {}} removeLabel="Remove">
        Disabled
      </InputChip>
    </div>
  ),
};

/** Suggested replies or queries. */
export const Suggestion: Story = {
  render: () => (
    <div style={row}>
      <SuggestionChip>Sounds good</SuggestionChip>
      <SuggestionChip>See you then</SuggestionChip>
      <SuggestionChip elevated>Elevated</SuggestionChip>
    </div>
  ),
};
