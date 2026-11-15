import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../../test/axe";
import { Carousel, CarouselItem, type CarouselLayout } from "./Carousel";

const names = ["Alpha", "Beta", "Gamma", "Delta"];
const items = names.map((name) => (
  <CarouselItem key={name} media={<img src="" alt="" />}>
    <p>{name}</p>
  </CarouselItem>
));

describe("Carousel", () => {
  it.each<CarouselLayout>(["multi-browse", "uncontained"])(
    "lays out every item as a named slide in a scrollable region (%s)",
    async (layout) => {
      const { container } = render(
        <Carousel aria-label="Projects" layout={layout}>
          {items}
        </Carousel>,
      );
      const carousel = screen.getByRole("region", { name: "Projects" });

      expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
      const slides = screen.getAllByRole("group");
      expect(slides).toHaveLength(4);
      expect(slides[0]).toHaveAccessibleName("1 of 4");
      expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
      expect(screen.getByText("Delta")).toBeInTheDocument();
      expect(carousel.firstElementChild).toHaveAttribute("tabindex", "0");
      await expectNoA11yViolations(container);
    },
  );

  it("takes its labels from props", () => {
    render(
      <Carousel
        aria-label="Projetos"
        roleDescription="carrossel"
        slideRoleDescription="item"
        slideLabel={(index, count) => `${index + 1} de ${count}`}
      >
        {items}
      </Carousel>,
    );

    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-roledescription",
      "carrossel",
    );
    const first = screen.getAllByRole("group")[0];
    expect(first).toHaveAccessibleName("1 de 4");
    expect(first).toHaveAttribute("aria-roledescription", "item");
  });

  it("forwards item props", () => {
    render(
      <Carousel aria-label="Projects">
        <CarouselItem data-testid="first" className="mine">
          First
        </CarouselItem>
      </Carousel>,
    );

    expect(screen.getByTestId("first")).toHaveClass("mine");
  });
});

describe("Carousel hero", () => {
  const hero = (props = {}) =>
    render(
      <Carousel aria-label="Projects" layout="hero" {...props}>
        {items}
      </Carousel>,
    );

  it("shows the current item large, its neighbour compressed", async () => {
    const { container } = hero();

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).toBeNull();
    // Only the current item and its neighbours are rendered
    expect(screen.getAllByRole("group")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Show slide 2" }),
    ).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("brings a compressed item to the middle when pressed", async () => {
    const onIndexChange = vi.fn();
    hero({ onIndexChange });

    await userEvent.click(screen.getByRole("button", { name: "Show slide 2" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.getAllByRole("group")).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: "Show slide 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show slide 3" }),
    ).toBeInTheDocument();
  });

  it("moves with the keyboard through the compressed items", async () => {
    hero();

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Show slide 2" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("follows `index` when controlled", () => {
    const { rerender } = hero({ index: 2 });
    expect(screen.getByText("Gamma")).toBeInTheDocument();

    rerender(
      <Carousel aria-label="Projects" layout="hero" index={3}>
        {items}
      </Carousel>,
    );
    expect(screen.getByText("Delta")).toBeInTheDocument();
    expect(screen.getAllByRole("group")).toHaveLength(2);
  });

  it("changes item on a touch swipe, not on a short one", () => {
    hero();
    const carousel = screen.getByRole("region");
    const swipe = (from: number, to: number) => {
      fireEvent.pointerDown(carousel, { pointerType: "touch", clientX: from });
      fireEvent.pointerUp(carousel, { pointerType: "touch", clientX: to });
    };

    swipe(200, 180);
    expect(screen.getByText("Alpha")).toBeInTheDocument();

    swipe(200, 100);
    expect(screen.getByText("Beta")).toBeInTheDocument();

    swipe(100, 200);
    expect(screen.getByText("Alpha")).toBeInTheDocument();

    // Past the first item it stays put
    swipe(100, 200);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("names the compressed items' buttons with showLabel", () => {
    hero({ showLabel: (index: number) => `Show ${names[index]}` });

    expect(
      screen.getByRole("button", { name: "Show Beta" }),
    ).toBeInTheDocument();
  });
});
