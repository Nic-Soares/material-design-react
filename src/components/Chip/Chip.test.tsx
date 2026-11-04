import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { AssistChip, FilterChip, InputChip, SuggestionChip } from "./Chip";

const icon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2 2 22h20z" />
  </svg>
);

describe("AssistChip and SuggestionChip", () => {
  it("are buttons that call onClick", async () => {
    const onClick = vi.fn();
    render(
      <>
        <AssistChip icon={icon} onClick={onClick}>
          Add to calendar
        </AssistChip>
        <SuggestionChip onClick={onClick}>Sounds good</SuggestionChip>
      </>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Add to calendar" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Sounds good" }));

    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("become links with href", () => {
    render(<AssistChip href="/map">Directions</AssistChip>);

    expect(screen.getByRole("link", { name: "Directions" })).toHaveAttribute(
      "href",
      "/map",
    );
  });

  it("are accessible, outlined or elevated", async () => {
    const { container } = render(
      <>
        <AssistChip icon={icon}>Share</AssistChip>
        <AssistChip elevated>Share</AssistChip>
        <SuggestionChip>Reply</SuggestionChip>
        <SuggestionChip elevated disabled>
          Reply
        </SuggestionChip>
      </>,
    );

    await expectNoA11yViolations(container);
  });
});

describe("FilterChip", () => {
  it("toggles with aria-pressed", async () => {
    const onSelectedChange = vi.fn();
    render(
      <FilterChip onSelectedChange={onSelectedChange}>Vegetarian</FilterChip>,
    );
    const chip = screen.getByRole("button", { name: "Vegetarian" });
    expect(chip).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(chip);

    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("follows `selected` when controlled", async () => {
    render(<FilterChip selected>Vegan</FilterChip>);
    const chip = screen.getByRole("button");

    await userEvent.click(chip);

    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("is accessible, selected or not", async () => {
    const { container } = render(
      <>
        <FilterChip icon={icon}>Off</FilterChip>
        <FilterChip defaultSelected>On</FilterChip>
        <FilterChip elevated disabled>
          Disabled
        </FilterChip>
      </>,
    );

    await expectNoA11yViolations(container);
  });
});

describe("InputChip", () => {
  it("shows the text, with no control by default", () => {
    render(<InputChip>Alice</InputChip>);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("has a named remove button", async () => {
    const onRemove = vi.fn();
    render(
      <InputChip onRemove={onRemove} removeLabel="Remove Alice">
        Alice
      </InputChip>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Remove Alice" }));

    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("can be a button too, separate from remove", async () => {
    const onClick = vi.fn();
    const onRemove = vi.fn();
    render(
      <InputChip onClick={onClick} onRemove={onRemove} removeLabel="Remove">
        Alice
      </InputChip>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Alice" }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("is accessible with an avatar, selected and disabled", async () => {
    const { container } = render(
      <>
        <InputChip avatar={<img src="data:," alt="" />}>Alice</InputChip>
        <InputChip selected onRemove={() => {}} removeLabel="Remove Bob">
          Bob
        </InputChip>
        <InputChip disabled onRemove={() => {}} removeLabel="Remove Carol">
          Carol
        </InputChip>
      </>,
    );

    await expectNoA11yViolations(container);
  });
});
