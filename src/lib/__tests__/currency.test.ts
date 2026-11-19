import { describe, expect, it } from "vitest";
import { flagEmoji, formatPrice, getCurrencyForCountry, SUPPORTED_COUNTRIES } from "../currency";

describe("getCurrencyForCountry", () => {
  it.each([
    ["MY", "MYR"],
    ["ID", "IDR"],
    ["US", "USD"],
    ["SG", "SGD"],
    ["CN", "CNY"],
    ["DE", "EUR"],
    ["GB", "GBP"],
    ["JP", "JPY"],
  ])("%s → %s", (country, currency) => {
    expect(getCurrencyForCountry(country)).toEqual({ currency, fallback: false });
  });

  it("accepts lowercase and padded country codes", () => {
    expect(getCurrencyForCountry(" my ")).toEqual({ currency: "MYR", fallback: false });
  });

  it("falls back to USD for an unmapped territory", () => {
    expect(getCurrencyForCountry("AQ")).toEqual({ currency: "USD", fallback: true });
  });

  it("falls back to USD for an empty code", () => {
    expect(getCurrencyForCountry("")).toEqual({ currency: "USD", fallback: true });
  });
});

describe("formatPrice", () => {
  it("formats with the currency's symbol and decimals", () => {
    // ICU versions differ on symbol spacing ("RM199.00" vs "RM 199.00").
    expect(formatPrice(199, "MYR", "en-MY")).toMatch(/^RM\s?199\.00$/);
  });

  it("respects zero-decimal currencies", () => {
    expect(formatPrice(150000, "IDR", "id-ID")).toMatch(/^Rp\s?150\.000$/);
  });

  it("formats USD in en-US", () => {
    expect(formatPrice(19.9, "USD", "en-US")).toBe("$19.90");
  });
});

describe("flagEmoji", () => {
  it("turns a country code into regional indicator symbols", () => {
    expect(flagEmoji("MY")).toBe("🇲🇾");
  });
});

describe("SUPPORTED_COUNTRIES", () => {
  it("lists every mapped country exactly once, sorted by name", () => {
    const codes = SUPPORTED_COUNTRIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    const names = SUPPORTED_COUNTRIES.map((c) => c.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});
