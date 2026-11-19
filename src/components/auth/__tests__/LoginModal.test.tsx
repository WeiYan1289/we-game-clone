import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { en } from "@/i18n/dictionaries/en";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import { validateLogin } from "@/lib/login";
import { LoginModal } from "../LoginModal";

describe("validateLogin", () => {
  it("requires both fields", () => {
    expect(validateLogin({ account: " ", password: "" })).toEqual({ account: "accountRequired", password: "passwordRequired" });
  });

  it.each(["12345", "12345678901", "13800138000"])("accepts QQ numbers and 11-digit phones (%s)", (account) => {
    expect(validateLogin({ account, password: "secret1" })).toEqual({});
  });

  it.each(["1234", "abc12345", "123456789012"])("rejects malformed accounts (%s)", (account) => {
    expect(validateLogin({ account, password: "secret1" }).account).toBe("accountInvalid");
  });

  it("rejects short passwords", () => {
    expect(validateLogin({ account: "12345", password: "12345" }).password).toBe("passwordShort");
  });
});

describe("LoginModal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const setup = (dict = zhCN.login) => {
    const onClose = vi.fn();
    render(<LoginModal dict={dict} locale="zh-CN" onClose={onClose} />);
    return { onClose, user: userEvent.setup() };
  };

  it("is a labelled dialog that says it is a demo", () => {
    setup();
    expect(screen.getByRole("dialog", { name: "登录 WeGame" })).toBeInTheDocument();
    expect(screen.getByText("演示 · 不会发送任何数据")).toBeInTheDocument();
  });

  it("shows field errors on an empty submit and focuses the first invalid field", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "登录" }));
    const account = screen.getByLabelText("QQ 号 / 手机号");
    expect(account).toHaveAttribute("aria-invalid", "true");
    expect(account).toHaveAccessibleDescription("请输入 QQ 号或手机号");
    expect(screen.getByLabelText("密码")).toHaveAccessibleDescription("请输入密码");
    expect(account).toHaveFocus();
  });

  it("validates formats", async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText("QQ 号 / 手机号"), "abc");
    await user.type(screen.getByLabelText("密码"), "123");
    await user.click(screen.getByRole("button", { name: "登录" }));
    expect(screen.getByText("请输入 5–11 位 QQ 号或 11 位手机号")).toBeInTheDocument();
    expect(screen.getByText("密码至少 6 位")).toBeInTheDocument();
  });

  it("valid submit shows a loading state, then the demo notice — and sends nothing", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { user } = setup();
    await user.type(screen.getByLabelText("QQ 号 / 手机号"), "13800138000");
    await user.type(screen.getByLabelText("密码"), "secret1");
    await user.click(screen.getByRole("button", { name: "登录" }));

    const busy = screen.getByRole("button", { name: "登录中…" });
    expect(busy).toBeDisabled();

    // Real ~1s simulated latency.
    expect(await screen.findByRole("status", {}, { timeout: 2500 })).toHaveTextContent(/演示站点/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    const { user } = setup();
    const password = screen.getByLabelText("密码");
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "显示密码" }));
    expect(password).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "隐藏密码" })).toBeInTheDocument();
  });

  it("links to the official site via the redirect page", () => {
    setup();
    expect(screen.getByRole("link", { name: /前往 WeGame 官网登录/ })).toHaveAttribute("href", "/go/login");
  });

  it("close button calls onClose", async () => {
    const { user, onClose } = setup();
    await user.click(screen.getByRole("button", { name: "关闭" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders in English", () => {
    setup(en.login);
    expect(screen.getByRole("dialog", { name: "Log in to WeGame" })).toBeInTheDocument();
  });
});
