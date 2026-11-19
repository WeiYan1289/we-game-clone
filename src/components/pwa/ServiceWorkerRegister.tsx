"use client";

import { useEffect } from "react";

/**
 * A worker left behind by an earlier production run (`npm start`) keeps
 * controlling the origin after `next dev` takes over the same port. Dev chunk
 * URLs stay the same between edits, so its cache-first rule would serve stale
 * CSS and JS. Outside production, remove it and its caches.
 */
async function removeLeftoverWorker() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  if (typeof caches === "undefined") return;
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith("wegame-")).map((key) => caches.delete(key)));
}

/**
 * Registers /sw.js in production builds only — a caching worker in dev would
 * serve stale chunks and fight hot reloading.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      removeLeftoverWorker().catch(() => {});
      return;
    }

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
