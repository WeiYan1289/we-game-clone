import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Header } from "../Header";

function setup() {
  const onOpenCurrency = vi.fn();
  const user = userEvent.setup();
  render(<Header onOpenCurrency={onOpenCurrency} />);
  return { user, onOpenCurrency };
}

describe("Header — developer platform dropdown", () => {
  it("opens on click and reflects state in aria-expanded", async () => {
    const { user } = setup();
    const trigger = screen.getByRole("button", { name: /开发者平台/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "正式发行游戏" })).toBeVisible();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const { user } = setup();
    const trigger = screen.getByRole("button", { name: /开发者平台/ });
    await user.click(trigger);

    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes on outside click", async () => {
    const { user } = setup();
    const trigger = screen.getByRole("button", { name: /开发者平台/ });
    await user.click(trigger);

    await user.click(document.body);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Header — mobile drawer", () => {
  it("opens, locks body scroll, and closes on Escape", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "打开菜单" }));

    const drawer = screen.getByRole("dialog", { name: "主菜单" });
    expect(drawer).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "主菜单" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("closes when a navigation link is chosen", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "打开菜单" }));
    const drawer = screen.getByRole("dialog", { name: "主菜单" });

    await user.click(drawer.querySelector("a[href='#feature']")!);

    expect(screen.queryByRole("dialog", { name: "主菜单" })).not.toBeInTheDocument();
  });
});

describe("Header — currency entry point", () => {
  it("calls onOpenCurrency from the region button", async () => {
    const { user, onOpenCurrency } = setup();

    await user.click(screen.getByRole("button", { name: /地区与货币/ }));

    expect(onOpenCurrency).toHaveBeenCalledOnce();
  });
});
