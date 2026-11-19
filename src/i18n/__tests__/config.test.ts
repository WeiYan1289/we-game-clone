import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, isLocale, LOCALES, localeForCountry, localePath } from "../config";

describe("locales", () => {
  it("supports Simplified Chinese (default), English, Malay and Indonesian", () => {
    expect(LOCALES).toEqual(["zh-CN", "en", "ms", "id"]);
    expect(DEFAULT_LOCALE).toBe("zh-CN");
  });

  it("narrows unknown strings", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});

describe("localeForCountry", () => {
  it.each([
    ["CN", "zh-CN"],
    ["HK", "zh-CN"],
    ["TW", "zh-CN"],
    ["MO", "zh-CN"],
    ["MY", "ms"],
    ["ID", "id"],
    ["SG", "en"],
    ["US", "en"],
    ["GB", "en"],
    ["AQ", "en"],
  ])("%s → %s", (country, locale) => {
    expect(localeForCountry(country)).toBe(locale);
  });

  it("is case-insensitive", () => {
    expect(localeForCountry("my")).toBe("ms");
  });
});

describe("localePath", () => {
  it("serves the default locale at the site root", () => {
    expect(localePath("zh-CN")).toBe("/");
  });

  it("prefixes other locales", () => {
    expect(localePath("en")).toBe("/en");
    expect(localePath("ms")).toBe("/ms");
  });
});
