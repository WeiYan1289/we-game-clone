"use client";

import { useId, useRef, useState } from "react";
import { DOWNLOADS } from "@/data/downloads";
import { useDismiss } from "@/hooks/useDismiss";
import { useMacArch, usePlatform } from "@/hooks/usePlatform";
import type { Dictionary } from "@/i18n/dictionaries";
import { Icon } from "../ui/Icon";
import styles from "./DownloadButton.module.css";

type Labels = { pc: string; mac: string };

type Props = {
  labels: Labels;
  dict: Dictionary["download"];
  variant: "header" | "hero" | "link";
  /** Force a platform (footer "Windows版" / "Mac版" links) instead of detecting it. */
  platform?: "windows" | "mac";
  className?: string;
};

/**
 * OS-aware download entry, matching the original:
 *  - Windows / unknown → direct link to the Windows installer
 *  - macOS → a chooser for Apple silicon vs Intel (with the detected chip
 *    marked "recommended" where Client Hints allow)
 *  - phones/tablets → a note that WeGame is a desktop app, plus direct links
 */
export function DownloadButton({ labels, dict, variant, platform: forced, className }: Props) {
  const detected = usePlatform();
  const platform = forced ?? detected;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popId = useId();
  const arch = useMacArch(platform === "mac");
  const needsChooser = platform === "mac" || platform === "mobile";
  const hoverable = variant !== "link";
  // A hover already opened the chooser; the click that follows must not close it.
  const openedByHover = useRef(false);

  useDismiss(rootRef, open, (reason) => {
    setOpen(false);
    if (reason === "escape") triggerRef.current?.focus();
  });

  const label = platform === "mac" ? labels.mac : labels.pc;
  const cls = `${styles.trigger} ${styles[variant]} ${className ?? ""}`;
  const icon = variant === "link" ? <Icon name={platform === "mac" ? "apple" : "windows"} size={14} /> : <Icon name="download" size={16} />;

  if (!needsChooser) {
    return (
      <a href={DOWNLOADS.windows} className={cls} rel="noopener">
        {icon}
        <span>{label}</span>
      </a>
    );
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || !hoverable || open) return;
        openedByHover.current = true;
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse" || !hoverable) return;
        openedByHover.current = false;
        setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={cls}
        aria-expanded={open}
        aria-controls={popId}
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            return;
          }
          setOpen((v) => !v);
        }}
      >
        {icon}
        <span>{label}</span>
      </button>

      <div id={popId} className={styles.popup} data-placement={variant === "header" ? "below" : "above"} hidden={!open}>
        {platform === "mobile" ? (
          <>
            <p className={styles.title}>{dict.mobileTitle}</p>
            <p className={styles.tips}>{dict.mobileText}</p>
            <a className={styles.option} href={DOWNLOADS.windows} rel="noopener">
              {dict.windows}
            </a>
          </>
        ) : (
          <p className={styles.title}>{dict.macTitle}</p>
        )}
        <a className={styles.option} href={DOWNLOADS.macIntel} rel="noopener" data-recommended={arch === "intel"}>
          {dict.macIntel}
          {arch === "intel" && <span className={styles.badge}>{dict.recommended}</span>}
        </a>
        <a className={styles.option} href={DOWNLOADS.macArm} rel="noopener" data-recommended={arch === "arm"}>
          {dict.macArm}
          {arch === "arm" && <span className={styles.badge}>{dict.recommended}</span>}
        </a>
        {platform === "mac" && (
          <p className={styles.tips}>
            {dict.macTips.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
