"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "../ui/Icon";
import styles from "./InstallPrompt.module.css";

/** Chromium-only event; not in lib.dom.d.ts. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Custom install entry point. Browsers that support `beforeinstallprompt`
 * (Chrome/Edge/Android) get a button; others keep their native install UI
 * (Safari: Share → Add to Home Screen; the manifest still applies).
 */
export function InstallPrompt({ dict }: { dict: Dictionary["pwa"] }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep our UI instead of the mini-infobar
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferred) return null;

  const install = async () => {
    const event = deferred;
    setDeferred(null); // the event can only be used once
    await event.prompt();
    await event.userChoice;
  };

  return (
    <div className={styles.prompt} role="region" aria-label={dict.installRegion}>
      <span className={styles.text}>{dict.installText}</span>
      <button type="button" className={styles.install} onClick={install} aria-label={dict.installLabel}>
        <Icon name="download" size={16} />
        {dict.install}
      </button>
      <button type="button" className={styles.dismiss} onClick={() => setDeferred(null)} aria-label={dict.dismiss}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
