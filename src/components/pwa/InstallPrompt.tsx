"use client";

import { useEffect, useState } from "react";
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
export function InstallPrompt() {
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
    <div className={styles.prompt} role="region" aria-label="安装应用">
      <span className={styles.text}>把 WeGame 装到桌面，离线也能打开</span>
      <button type="button" className={styles.install} onClick={install} aria-label="安装 WeGame 应用">
        <Icon name="download" size={16} />
        安装
      </button>
      <button type="button" className={styles.dismiss} onClick={() => setDeferred(null)} aria-label="暂不安装">
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
