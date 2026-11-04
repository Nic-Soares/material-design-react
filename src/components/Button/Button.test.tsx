import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Button, type ButtonVariant } from "./Button";

const star = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2 2 22h20z" />
  </svg>
);

describe("Button", () => {
  it("renders a native button named by its label", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  it("forwards native props, className and ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button
        ref={ref}
        id="save"
        type="submit"
        className="mine"
        aria-describedby="hint"
      >
        Save
      </Button>,
    );
    const button = screen.getByRole("button");

    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("id", "save");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-describedby", "hint");
    expect(button).toHaveClass("mine");
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("doesn't call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("can be just an icon, named with aria-label", () => {
    render(<Button icon={star} aria-label="Favorite" />);

    expect(screen.getByRole("button", { name: "Favorite" })).toBeVisible();
  });

  it.each<ButtonVariant>(["filled", "tonal", "outlined", "text", "elevated"])(
    "is accessible as a %s button",
    async (variant) => {
      const { container } = render(
        <Button variant={variant} icon={star}>
          Save
        </Button>,
      );

      await expectNoA11yViolations(container);
    },
  );
});

describe("Button as a toggle", () => {
  it("is a plain button unless it toggles", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  it("toggles its own state when uncontrolled", async () => {
    const onSelectedChange = vi.fn();
    render(
      <Button defaultSelected={false} onSelectedChange={onSelectedChange}>
        Bold
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("follows `selected` when controlled", async () => {
    const onSelectedChange = vi.fn();
    render(
      <Button selected onSelectedChange={onSelectedChange}>
        Bold
      </Button>,
    );
    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(onSelectedChange).toHaveBeenCalledWith(false);
  });

  it("toggles with the keyboard", async () => {
    render(<Button defaultSelected={false}>Bold</Button>);
    const button = screen.getByRole("button");

    button.focus();
    await userEvent.keyboard(" ");

    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("doesn't toggle when onClick prevents it", async () => {
    render(
      <Button defaultSelected={false} onClick={(e) => e.preventDefault()}>
        Bold
      </Button>,
    );
    const button = screen.getByRole("button");

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("never toggles as a text button, as in M3", () => {
    render(
      <Button variant="text" defaultSelected={false}>
        Bold
      </Button>,
    );

    expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
  });

  it("is accessible when selected", async () => {
    const { container } = render(
      <Button variant="outlined" selected>
        Bold
      </Button>,
    );

    await expectNoA11yViolations(container);
  });

  it("renders a link with href, forwarding anchor props and ref", async () => {
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(
      <Button ref={ref} href="/projects" target="_blank" variant="tonal">
        Projects
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Projects" });

    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("aria-pressed");
    expect(link).not.toHaveAttribute("type");
    await expectNoA11yViolations(container);
  });

  it("drops href and sets aria-disabled on a disabled link", () => {
    render(
      <Button href="/projects" disabled>
        Projects
      </Button>,
    );
    const link = screen.getByText("Projects").closest("a");

    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onRippleEnd once the press ripple has faded", async () => {
    const onRippleEnd = vi.fn();
    render(<Button onRippleEnd={onRippleEnd}>Save</Button>);

    // jsdom can't animate, so the ripple fades at once
    await userEvent.click(screen.getByRole("button"));

    expect(onRippleEnd).toHaveBeenCalledOnce();
  });
});
