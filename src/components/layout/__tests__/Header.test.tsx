import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/i18n/dictionaries/en";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import { Header } from "../Header";

function setup(props: Partial<Parameters<typeof Header>[0]> = {}) {
  const onOpenRegion = vi.fn();
  const user = userEvent.setup();
  render(<Header dict={zhCN.header} downloadDict={zhCN.download} onOpenRegion={onOpenRegion} {...props} />);
  return { user, onOpenRegion };
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

describe("Header — mobile menu (dropdown under the bar, hamburger on the left)", () => {
  it("toggles open/closed from the same button and locks page scroll", async () => {
    const { user } = setup();
    const toggle = screen.getByRole("button", { name: "打开菜单" });

    await user.click(toggle);
    const menu = screen.getByRole("navigation", { name: "主菜单" });
    expect(menu).toBeVisible();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("关闭菜单");
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(toggle);
    expect(screen.queryByRole("navigation", { name: "主菜单" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("lists the original's items, closes on Escape", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "打开菜单" }));
    const menu = screen.getByRole("navigation", { name: "主菜单" });
    for (const label of ["首页", "商店", "正式发行游戏", "先锋测试游戏", "视频创作者招募计划"]) {
      expect(within(menu).getByRole("link", { name: label })).toBeInTheDocument();
    }
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "主菜单" })).not.toBeInTheDocument();
  });

  it("closes when a link is chosen", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "打开菜单" }));
    await user.click(within(screen.getByRole("navigation", { name: "主菜单" })).getByRole("link", { name: "商店" }));
    expect(screen.queryByRole("navigation", { name: "主菜单" })).not.toBeInTheDocument();
  });

  it("offers the region & language entry inside the menu", async () => {
    const { user, onOpenRegion } = setup();
    await user.click(screen.getByRole("button", { name: "打开菜单" }));
    await user.click(within(screen.getByRole("navigation", { name: "主菜单" })).getByRole("button", { name: /地区与语言/ }));
    expect(onOpenRegion).toHaveBeenCalledOnce();
    expect(screen.queryByRole("navigation", { name: "主菜单" })).not.toBeInTheDocument();
  });
});

describe("Header — region & language", () => {
  it("desktop button opens the region modal", async () => {
    const { user, onOpenRegion } = setup();
    await user.click(screen.getByRole("button", { name: /^地区与语言/ }));
    expect(onOpenRegion).toHaveBeenCalledOnce();
  });

  it("shows the active currency once known", () => {
    setup({ regionBadge: "MYR" });
    expect(screen.getByRole("button", { name: "地区与语言（MYR）" })).toHaveTextContent("MYR");
  });

  it("renders translated labels", () => {
    render(<Header dict={en.header} downloadDict={en.download} onOpenRegion={() => {}} />);
    expect(screen.getByRole("link", { name: "Store" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Log in/ }).length).toBeGreaterThan(0);
  });
});
