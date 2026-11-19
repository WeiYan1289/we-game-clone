import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DOWNLOADS } from "@/data/downloads";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import { DownloadButton } from "../DownloadButton";

const UA = {
  win: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36",
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
};

const labels = { pc: "下载客户端", mac: "下载 Mac 版" };

function renderAs(userAgent: string, props: Partial<Parameters<typeof DownloadButton>[0]> = {}) {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent);
  render(<DownloadButton labels={labels} dict={zhCN.download} variant="header" {...props} />);
  return userEvent.setup();
}

afterEach(() => vi.restoreAllMocks());

describe("DownloadButton", () => {
  it("Windows: links straight to the official Windows installer", () => {
    renderAs(UA.win);
    expect(screen.getByRole("link", { name: "下载客户端" })).toHaveAttribute("href", DOWNLOADS.windows);
  });

  it("macOS: shows the Mac label and a chip chooser with both builds", async () => {
    const user = renderAs(UA.mac);
    const trigger = screen.getByRole("button", { name: "下载 Mac 版" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(screen.getByText("请根据Mac芯片选择对应版本")).toBeVisible();
    expect(screen.getByRole("link", { name: /下载 Intel 版/ })).toHaveAttribute("href", DOWNLOADS.macIntel);
    expect(screen.getByRole("link", { name: /下载 M 系列版/ })).toHaveAttribute("href", DOWNLOADS.macArm);
  });

  it("macOS: Escape closes the chooser and returns focus", async () => {
    const user = renderAs(UA.mac);
    const trigger = screen.getByRole("button", { name: "下载 Mac 版" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("phones: explains WeGame is a desktop app and still offers every installer", async () => {
    const user = renderAs(UA.iphone);
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("WeGame 是电脑端游戏平台")).toBeVisible();
    expect(screen.getByRole("link", { name: "Windows 版" })).toHaveAttribute("href", DOWNLOADS.windows);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("a forced platform (footer links) ignores detection", () => {
    renderAs(UA.mac, { platform: "windows", variant: "link" });
    expect(screen.getByRole("link", { name: "下载客户端" })).toHaveAttribute("href", DOWNLOADS.windows);
  });
});
