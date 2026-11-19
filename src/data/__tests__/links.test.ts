import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { goPath, LINK_SLUGS, ORIGINAL_LINKS, originalSearchUrl } from "../links";

describe("original-site link registry", () => {
  it("points every slug at an absolute URL on the original web", () => {
    for (const slug of LINK_SLUGS) expect(ORIGINAL_LINKS[slug].url).toMatch(/^https?:\/\/[^/]+/);
  });

  it("uses URL-safe slugs", () => {
    for (const slug of LINK_SLUGS) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it.each(LOCALES)("has a translated label for every slug in %s", (locale) => {
    for (const slug of LINK_SLUGS) expect(ORIGINAL_LINKS[slug].label(dictionaries[locale]).trim()).not.toBe("");
  });

  it("covers the footer's legal and partner links one-to-one", () => {
    expect(LINK_SLUGS.filter((s) => s.startsWith("legal-"))).toHaveLength(dictionaries["zh-CN"].footer.legal.length);
    expect(LINK_SLUGS.filter((s) => s.startsWith("friend-"))).toHaveLength(dictionaries["zh-CN"].footer.friendLinks.length);
  });
});

describe("goPath", () => {
  it("serves the default locale without a prefix", () => {
    expect(goPath("zh-CN", "store")).toBe("/go/store");
  });

  it("prefixes other locales", () => {
    expect(goPath("ms", "store")).toBe("/ms/go/store");
  });

  it("carries a search query", () => {
    expect(goPath("en", "search", "黑神话 悟空")).toBe("/en/go/search?q=%E9%BB%91%E7%A5%9E%E8%AF%9D%20%E6%82%9F%E7%A9%BA");
  });
});

describe("originalSearchUrl", () => {
  it("builds the original store search URL", () => {
    expect(originalSearchUrl("鸣潮")).toBe("https://www.wegame.com.cn/store/games?search_key_word=%E9%B8%A3%E6%BD%AE");
  });

  it("falls back to the store when the query is empty", () => {
    expect(originalSearchUrl("  ")).toBe("https://www.wegame.com.cn/store");
  });
});
