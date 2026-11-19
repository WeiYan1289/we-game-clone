"use client";

import { type RefObject, useEffect, useRef } from "react";

/**
 * Calls `onDismiss` on Escape or on a pointer-down outside `ref` while `active`.
 * Shared by the nav dropdown, mobile drawer and popovers.
 */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: (reason: "escape" | "outside") => void,
) {
  // Keep the latest callback without re-binding listeners every render.
  const callback = useRef(onDismiss);
  useEffect(() => {
    callback.current = onDismiss;
  });

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback.current("escape");
    };
    const onPointer = (e: PointerEvent | MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) callback.current("outside");
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [active, ref]);
}
