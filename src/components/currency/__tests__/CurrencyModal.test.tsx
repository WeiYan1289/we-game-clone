import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { GeoState } from "@/hooks/useGeoCurrency";
import { en } from "@/i18n/dictionaries/en";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import { CurrencyModal } from "../CurrencyModal";

function setup(state: GeoState, extra: Partial<Parameters<typeof CurrencyModal>[0]> = {}) {
  const props = {
    state,
    dict: en.region,
    locale: "en" as const,
    onLocate: vi.fn(),
    onChooseCountry: vi.fn(),
    onChangeLocale: vi.fn(),
    onClose: vi.fn(),
    ...extra,
  };
  render(<CurrencyModal {...props} />);
  return { ...props, user: userEvent.setup() };
}

describe("CurrencyModal", () => {
  it("idle: explains the privacy trade-off and offers detection", async () => {
    const { user, onLocate } = setup({ status: "idle" });
    expect(screen.getByRole("dialog", { name: /region, language & currency/i })).toBeInTheDocument();
    expect(screen.getByText(/bigdatacloud/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /detect my location/i }));
    expect(onLocate).toHaveBeenCalledOnce();
  });

  it("locating: shows a live status instead of the action button", () => {
    setup({ status: "locating" });
    expect(screen.getByRole("status")).toHaveTextContent(/waiting for location permission/i);
    expect(screen.queryByRole("button", { name: /detect my location/i })).not.toBeInTheDocument();
  });

  it("resolving: tells the user what it is doing", () => {
    setup({ status: "resolving", coords: { lat: 3.1, lon: 101.6 } });
    expect(screen.getByRole("status")).toHaveTextContent(/looking up your country/i);
  });

  it("success: shows country, currency code and name, and a formatted sample price", () => {
    setup({ status: "success", countryCode: "MY", countryName: "Malaysia", currency: "MYR", fallbackCurrency: false, source: "api" });
    expect(screen.getByText("Malaysia", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("MYR")).toBeInTheDocument();
    expect(screen.getByText(/malaysian ringgit/i)).toBeInTheDocument();
    expect(screen.getByText(/RM\s?199\.00/)).toBeInTheDocument();
  });

  it("success with an unmapped country: says USD is a fallback", () => {
    setup({ status: "success", countryCode: "AQ", countryName: "Antarctica", currency: "USD", fallbackCurrency: true, source: "api" });
    expect(screen.getByText(/no local currency on file/i)).toBeInTheDocument();
  });

  it("success via the offline lookup: labels the result as approximate", () => {
    setup({ status: "success", countryCode: "ID", countryName: "Indonesia", currency: "IDR", source: "offline" });
    expect(screen.getByText(/^approximate/i)).toBeInTheDocument();
  });

  it("denied: explains how to fix it and offers a manual country picker", async () => {
    const { user, onChooseCountry } = setup({ status: "denied", message: "Location permission was denied." });
    expect(screen.getByRole("alert")).toHaveTextContent(/permission was denied/i);

    await user.selectOptions(screen.getByLabelText(/choose your country/i), "MY");
    expect(onChooseCountry).toHaveBeenCalledWith("MY");
  });

  it.each(["timeout", "unavailable", "error"] as const)("%s: offers a retry", async (status) => {
    const { user, onLocate } = setup({ status, message: "Something went wrong." });
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onLocate).toHaveBeenCalledOnce();
  });

  it("unsupported: hides detection and keeps the manual picker", () => {
    setup({ status: "unsupported", message: "This browser doesn't support location detection." });
    expect(screen.queryByRole("button", { name: /try again|detect/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/choose your country/i)).toBeInTheDocument();
  });

  it("close button calls onClose", async () => {
    const { user, onClose } = setup({ status: "idle" });
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("language picker switches the page locale", async () => {
    const { user, onChangeLocale } = setup({ status: "idle" });
    const picker = screen.getByLabelText(/page language/i);
    expect(picker).toHaveValue("en");
    await user.selectOptions(picker, "ms");
    expect(onChangeLocale).toHaveBeenCalledWith("ms");
  });

  it("announces when the language was switched to match the location", () => {
    setup(
      { status: "success", countryCode: "MY", countryName: "Malaysia", currency: "MYR", source: "api" },
      { languageSwitched: true },
    );
    expect(screen.getByText(/switched to your local language/i)).toBeInTheDocument();
  });

  it("renders in Chinese with the zh-CN dictionary", () => {
    setup({ status: "idle" }, { dict: zhCN.region, locale: "zh-CN" });
    expect(screen.getByRole("dialog", { name: "地区、语言与货币" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /检测我的位置/ })).toBeInTheDocument();
  });
});
