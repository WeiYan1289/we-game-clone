/**
 * Which WeGame installer to offer. Pure functions over navigator-like input so
 * they can be unit-tested with fixed User-Agent strings.
 */

export type Platform = "windows" | "mac" | "mobile" | "other";
export type MacArch = "arm" | "intel" | "unknown";

type PlatformInput = {
  userAgent: string;
  /** `navigator.userAgentData.platform` (Chromium Client Hints), if available. */
  uaPlatform?: string;
  /** `navigator.userAgentData.mobile`, if available. */
  uaMobile?: boolean;
  maxTouchPoints?: number;
};

export function detectPlatform({ userAgent, uaPlatform, uaMobile, maxTouchPoints = 0 }: PlatformInput): Platform {
  if (uaMobile) return "mobile";
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)) return "mobile";

  const platform = uaPlatform?.toLowerCase();
  if (platform === "windows") return "windows";
  if (platform === "macos") return "mac";

  if (/Windows/i.test(userAgent)) return "windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) {
    // iPadOS reports a desktop Mac UA; touch support gives it away.
    return maxTouchPoints > 1 ? "mobile" : "mac";
  }
  return "other";
}

/** `getHighEntropyValues(["architecture"])` → which Mac build to recommend. */
export function macArchFromHints(architecture: string | undefined): MacArch {
  if (architecture === "arm") return "arm";
  if (architecture === "x86") return "intel";
  return "unknown";
}
