import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PosterCarousel } from "../PosterCarousel";

const ITEMS = [
  { id: "a", name: "Alpha", poster: "/a.png" },
  { id: "b", name: "Bravo", poster: "/b.png" },
  { id: "c", name: "Charlie", poster: "/c.png" },
];

const activeDot = () => screen.getAllByRole("button", { name: /^第 \d 张/ }).find((b) => b.getAttribute("aria-current") === "true");

describe("PosterCarousel", () => {
  afterEach(() => vi.useRealTimers());

  const setup = (autoplayMs?: number) => {
    if (autoplayMs) vi.useFakeTimers();
    const user = userEvent.setup();
    render(<PosterCarousel items={ITEMS} autoplayMs={autoplayMs} />);
    return user;
  };

  it("starts on the first slide", () => {
    setup();
    expect(activeDot()).toHaveAccessibleName("第 1 张：Alpha");
  });

  it("next wraps from the last slide to the first", async () => {
    const user = setup();
    const next = screen.getByRole("button", { name: "下一个" });
    await user.click(next);
    await user.click(next);
    expect(activeDot()).toHaveAccessibleName("第 3 张：Charlie");
    await user.click(next);
    expect(activeDot()).toHaveAccessibleName("第 1 张：Alpha");
  });

  it("prev wraps from the first slide to the last", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "上一个" }));
    expect(activeDot()).toHaveAccessibleName("第 3 张：Charlie");
  });

  it("dots jump directly to a slide", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "第 2 张：Bravo" }));
    expect(activeDot()).toHaveAccessibleName("第 2 张：Bravo");
  });

  it("autoplay advances on the interval", () => {
    setup(3000);
    act(() => vi.advanceTimersByTime(3000));
    expect(activeDot()).toHaveAccessibleName("第 2 张：Bravo");
  });

  it("autoplay pauses while hovered", () => {
    setup(3000);
    fireEvent.pointerEnter(screen.getByRole("region", { name: "热门游戏" }));
    act(() => vi.advanceTimersByTime(9000));
    expect(activeDot()).toHaveAccessibleName("第 1 张：Alpha");
  });
});
