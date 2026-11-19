import { describe, expect, it } from "vitest";
import { detectPlatform, macArchFromHints } from "../platform";

const UA = {
  win: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  android: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36",
  linux: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
};

describe("detectPlatform", () => {
  it.each([
    [UA.win, "windows"],
    [UA.mac, "mac"],
    [UA.iphone, "mobile"],
    [UA.android, "mobile"],
    [UA.linux, "other"],
  ])("%s → %s", (ua, expected) => {
    expect(detectPlatform({ userAgent: ua })).toBe(expected);
  });

  it("treats iPadOS (desktop-class Safari UA with touch) as mobile", () => {
    expect(detectPlatform({ userAgent: UA.mac, maxTouchPoints: 5 })).toBe("mobile");
  });

  it("prefers User-Agent Client Hints when available", () => {
    expect(detectPlatform({ userAgent: UA.linux, uaPlatform: "Windows" })).toBe("windows");
    expect(detectPlatform({ userAgent: UA.linux, uaPlatform: "macOS" })).toBe("mac");
    expect(detectPlatform({ userAgent: UA.win, uaMobile: true })).toBe("mobile");
  });
});

describe("macArchFromHints", () => {
  it("maps Client Hints architecture to the WeGame build", () => {
    expect(macArchFromHints("arm")).toBe("arm");
    expect(macArchFromHints("x86")).toBe("intel");
    expect(macArchFromHints(undefined)).toBe("unknown");
  });
});
