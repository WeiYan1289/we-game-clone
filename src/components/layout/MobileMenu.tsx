"use client";

import { useRef } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useDismiss } from "@/hooks/useDismiss";
import { Icon } from "../ui/Icon";
import styles from "./MobileMenu.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenRegion: () => void;
  regionLabel: string;
  dict: Dictionary["header"];
};

/**
 * The original's mobile menu: a full-width panel that drops down from under
 * the header on an opaque backdrop (page imagery never shows through).
 */
export function MobileMenu({ open, onClose, onOpenRegion, regionLabel, dict }: Props) {
  const panelRef = useRef<HTMLElement>(null);
  useBodyScrollLock(open);
  // The toggle button lives in the header, so outside clicks there are handled by the toggle itself.
  useDismiss(panelRef, open, (reason) => reason === "escape" && onClose());

  if (!open) return null;

  const links = [
    { label: dict.nav.home, href: "#kv", current: true },
    { label: dict.nav.store, href: "#topic" },
    ...dict.developerMenu.map((label) => ({ label, href: "#" })),
    { label: dict.creator, href: "#college" },
  ];

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" data-overlay-open="" />
      <nav ref={panelRef} id="mobile-menu" className={styles.menu} aria-label={dict.menuLabel}>
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={styles.link}
                aria-current={link.current ? "page" : undefined}
                onClick={onClose}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button type="button" className={styles.link} onClick={onOpenRegion} aria-label={regionLabel}>
              <Icon name="globe" size={18} />
              {regionLabel}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
