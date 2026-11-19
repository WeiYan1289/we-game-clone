import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tabs } from "../Tabs";

const ITEMS = [
  { id: "guide", label: "点位教学" },
  { id: "runes", label: "符文推荐" },
  { id: "ai", label: "AI 助手" },
];

const setup = (autoAdvanceMs?: number) =>
  render(
    <Tabs
      label="游戏助手"
      items={ITEMS}
      autoAdvanceMs={autoAdvanceMs}
      panels={ITEMS.map((item) => (
        <p key={item.id}>{item.label} 内容</p>
      ))}
    />,
  );

/** All panels stay in the DOM (mobile shows them stacked); desktop CSS shows the active one. */
const activePanel = () => screen.getAllByRole("tabpanel").find((p) => p.dataset.active === "true");

describe("Tabs", () => {
  afterEach(() => vi.useRealTimers());

  it("renders every panel and marks the first active", () => {
    setup();
    expect(screen.getAllByRole("tabpanel")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: /点位教学/ })).toHaveAttribute("aria-selected", "true");
    expect(activePanel()).toHaveTextContent("点位教学 内容");
  });

  it("links each tab to its own panel", () => {
    setup();
    const tab = screen.getByRole("tab", { name: /符文推荐/ });
    const panel = document.getElementById(tab.getAttribute("aria-controls")!);
    expect(panel).toHaveTextContent("符文推荐 内容");
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });

  it("click selects a tab and activates its panel", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("tab", { name: /AI 助手/ }));
    expect(screen.getByRole("tab", { name: /AI 助手/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /点位教学/ })).toHaveAttribute("aria-selected", "false");
    expect(activePanel()).toHaveTextContent("AI 助手 内容");
  });

  it("ArrowRight moves focus and selection, wrapping at the end", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("tab", { name: /AI 助手/ }));
    await user.keyboard("{ArrowRight}");
    const first = screen.getByRole("tab", { name: /点位教学/ });
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("aria-selected", "true");
  });

  it("ArrowLeft wraps from the first tab to the last", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("tab", { name: /点位教学/ }));
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /AI 助手/ })).toHaveAttribute("aria-selected", "true");
  });

  it("only the selected tab is in the tab order", () => {
    setup();
    const [a, b, c] = screen.getAllByRole("tab");
    expect(a).toHaveAttribute("tabindex", "0");
    expect(b).toHaveAttribute("tabindex", "-1");
    expect(c).toHaveAttribute("tabindex", "-1");
  });

  it("auto-advances after the interval", () => {
    vi.useFakeTimers();
    setup(5000);
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("tab", { name: /符文推荐/ })).toHaveAttribute("aria-selected", "true");
  });

  it("pauses auto-advance while focus is inside the tab list", () => {
    vi.useFakeTimers();
    setup(5000);
    const first = screen.getByRole("tab", { name: /点位教学/ });
    act(() => first.focus());
    act(() => vi.advanceTimersByTime(15000));
    expect(first).toHaveAttribute("aria-selected", "true");
    expect(first).toHaveFocus();
  });
});
