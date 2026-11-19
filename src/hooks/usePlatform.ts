"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { detectPlatform, type MacArch, macArchFromHints, type Platform } from "@/lib/platform";

type UAData = {
  platform?: string;
  mobile?: boolean;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
};

const uaData = () => (navigator as Navigator & { userAgentData?: UAData }).userAgentData;

// Returns a string, so useSyncExternalStore sees a stable snapshot without caching.
function snapshot(): Platform {
  const data = uaData();
  return detectPlatform({
    userAgent: navigator.userAgent,
    uaPlatform: data?.platform,
    uaMobile: data?.mobile,
    maxTouchPoints: navigator.maxTouchPoints,
  });
}

const noopSubscribe = () => () => {};

/**
 * Visitor's OS for picking the installer. "unknown" during SSR/hydration, so
 * server HTML shows the neutral Windows/"download client" label (the original's
 * default) and switches after mount — no hydration mismatch.
 */
export function usePlatform(): Platform | "unknown" {
  return useSyncExternalStore(noopSubscribe, snapshot, () => "unknown");
}

/** Apple silicon vs Intel, when Chromium's Client Hints can tell; otherwise "unknown" (Safari/Firefox). */
export function useMacArch(enabled: boolean): MacArch {
  const [arch, setArch] = useState<MacArch>("unknown");
  useEffect(() => {
    const getHints = uaData()?.getHighEntropyValues;
    if (!enabled || !getHints) return;
    let cancelled = false;
    getHints
      .call(uaData(), ["architecture"])
      .then(({ architecture }) => !cancelled && setArch(macArchFromHints(architecture)))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return arch;
}
