import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { IconButton, type IconButtonVariant } from "./IconButton";

const icon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" data-testid="icon">
    <path d="M12 2 2 22h20z" />
  </svg>
);
const filledIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" data-testid="filled-icon">
    <path d="M12 2 2 22h20z" />
  </svg>
);

describe("IconButton", () => {
  it("is a native button named by aria-label", () => {
    render(<IconButton icon={icon} aria-label="Search" />);
    const button = screen.getByRole("button", { name: "Search" });

    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  it("forwards native props and ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} icon={icon} aria-label="Search" id="search" />,
    );

    expect(ref.current).toBe(screen.getByRole("button"));
    expect(ref.current).toHaveAttribute("id", "search");
  });

  it("calls onClick, not when disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <IconButton icon={icon} aria-label="Search" onClick={onClick} />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <IconButton icon={icon} aria-label="Search" onClick={onClick} disabled />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("toggles and swaps to the selected icon", async () => {
    render(
      <IconButton
        icon={icon}
        selectedIcon={filledIcon}
        aria-label="Favorite"
        defaultSelected={false}
      />,
    );
    const button = screen.getByRole("button", { name: "Favorite" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByTestId("icon")).toBeInTheDocument();

    await userEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("filled-icon")).toBeInTheDocument();
  });

  it.each<IconButtonVariant>(["standard", "filled", "tonal", "outlined"])(
    "is accessible as a %s icon button, selected or not",
    async (variant) => {
      const { container } = render(
        <>
          <IconButton icon={icon} aria-label="Plain" variant={variant} />
          <IconButton
            icon={icon}
            aria-label="Toggle"
            variant={variant}
            selected
          />
        </>,
      );

      await expectNoA11yViolations(container);
    },
  );
});
