import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InstallPrompt } from "../InstallPrompt";

function fireBeforeInstallPrompt(outcome: "accepted" | "dismissed" = "accepted") {
  const event = new Event("beforeinstallprompt", { cancelable: true }) as Event & {
    prompt: ReturnType<typeof vi.fn>;
    userChoice: Promise<{ outcome: string }>;
  };
  event.prompt = vi.fn().mockResolvedValue(undefined);
  event.userChoice = Promise.resolve({ outcome });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

describe("InstallPrompt", () => {
  it("renders nothing until the browser says the app is installable", () => {
    render(<InstallPrompt />);
    expect(screen.queryByRole("button", { name: /安装/ })).not.toBeInTheDocument();
  });

  it("shows an install button after beforeinstallprompt and suppresses the mini-infobar", () => {
    render(<InstallPrompt />);
    const event = fireBeforeInstallPrompt();
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole("button", { name: "安装 WeGame 应用" })).toBeVisible();
  });

  it("calls prompt() on click and hides once the user accepts", async () => {
    const user = userEvent.setup();
    render(<InstallPrompt />);
    const event = fireBeforeInstallPrompt("accepted");

    await user.click(screen.getByRole("button", { name: "安装 WeGame 应用" }));

    expect(event.prompt).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "安装 WeGame 应用" })).not.toBeInTheDocument();
  });

  it("can be dismissed", async () => {
    const user = userEvent.setup();
    render(<InstallPrompt />);
    fireBeforeInstallPrompt();

    await user.click(screen.getByRole("button", { name: "暂不安装" }));

    expect(screen.queryByRole("button", { name: "安装 WeGame 应用" })).not.toBeInTheDocument();
  });

  it("hides after the appinstalled event", () => {
    render(<InstallPrompt />);
    fireBeforeInstallPrompt();
    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });
    expect(screen.queryByRole("button", { name: "安装 WeGame 应用" })).not.toBeInTheDocument();
  });
});
