"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js in production builds only — a caching worker in dev would
 * serve stale chunks and fight hot reloading.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register(`/sw.js?v=${process.env.NEXT_PUBLIC_BUILD_ID}`, { scope: "/", updateViaCache: "none" })
        .catch((error) => console.error("Service worker registration failed:", error));
    };

    // Don't compete with first-load network traffic.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
