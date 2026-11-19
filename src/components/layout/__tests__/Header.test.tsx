import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { en } from "@/i18n/dictionaries/en";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import { Header } from "../Header";

function setup(props: Partial<Parameters<typeof Header>[0]> = {}) {
  const onOpenRegion = vi.fn();
  const onOpenLogin = vi.fn();
  const user = userEvent.setup();
  render(
    <Header
      locale="zh-CN"
      dict={zhCN.header}
      downloadDict={zhCN.download}
      onOpenRegion={onOpenRegion}
      onOpenLogin={onOpenLogin}
      {...props}
    />,
  );
  return { user, onOpenRegion, onOpenLogin };
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

  it("keeps region & language out of the menu", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "打开菜单" }));
    const menu = screen.getByRole("navigation", { name: "主菜单" });
    expect(within(menu).queryByRole("button", { name: /地区与语言/ })).not.toBeInTheDocument();
  });
});

describe("Header — region & language", () => {
  it("is the last control in the bar (top-right corner on every screen size)", async () => {
    const { user, onOpenRegion } = setup();
    const region = screen.getByRole("button", { name: /^地区与语言/ });
    const controls = screen.getByRole("banner").querySelectorAll("a, button");
    expect(controls[controls.length - 1]).toBe(region);

    await user.click(region);
    expect(onOpenRegion).toHaveBeenCalledOnce();
  });

  it("shows the active currency once known", () => {
    setup({ regionBadge: "MYR" });
    expect(screen.getByRole("button", { name: "地区与语言（MYR）" })).toHaveTextContent("MYR");
  });

  it("renders translated labels and locale-aware links", () => {
    render(<Header locale="en" dict={en.header} downloadDict={en.download} onOpenRegion={() => {}} onOpenLogin={() => {}} />);
    expect(screen.getByRole("link", { name: "Store" })).toHaveAttribute("href", "/en/go/store");
    expect(screen.getByRole("button", { name: /Log in/ })).toBeInTheDocument();
  });
});

describe("Header — links to the original site go via the redirect page", () => {
  it("uses /go/<slug> for store, changelog and feedback", () => {
    setup();
    expect(screen.getByRole("link", { name: "商店" })).toHaveAttribute("href", "/go/store");
    expect(screen.getByRole("link", { name: "更新日志" })).toHaveAttribute("href", "/go/changelog");
    expect(screen.getByRole("link", { name: "帮助与反馈" })).toHaveAttribute("href", "/go/feedback");
  });

  it("search submits to the redirect page with the query", async () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    const { user } = setup();
    const input = screen.getAllByLabelText("搜索游戏")[0];
    await user.type(input, "鸣潮{Enter}");
    expect(assign).toHaveBeenCalledWith("/go/search?q=%E9%B8%A3%E6%BD%AE");
    vi.unstubAllGlobals();
  });
});

describe("Header — login", () => {
  it("opens the login modal instead of navigating", async () => {
    const { user, onOpenLogin } = setup();
    await user.click(screen.getByRole("button", { name: /登录/ }));
    expect(onOpenLogin).toHaveBeenCalledOnce();
  });
});
