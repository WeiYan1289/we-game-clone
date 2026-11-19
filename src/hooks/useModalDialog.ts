"use client";

import { type RefObject, useEffect } from "react";

/**
 * Opens a <dialog> as a modal on mount: the browser then provides the focus
 * trap, Escape (`cancel` event), inert background and top-layer stacking.
 * Falls back to the `open` attribute where showModal is missing (e.g. jsdom).
 */
export function useModalDialog(ref: RefObject<HTMLDialogElement | null>) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === "function") {
      try {
        dialog.showModal();
        return;
      } catch {
        /* fall through */
      }
    }
    dialog.setAttribute("open", "");
  }, [ref]);
}
