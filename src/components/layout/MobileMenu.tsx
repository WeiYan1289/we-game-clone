"use client";

import { useRef } from "react";
import { goPath } from "@/data/links";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useDismiss } from "@/hooks/useDismiss";
import styles from "./MobileMenu.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  dict: Dictionary["header"];
  locale: Locale;
};

/**
 * The original's mobile menu: a full-width panel that drops down from under
 * the header on an opaque backdrop (page imagery never shows through).
 */
export function MobileMenu({ open, onClose, dict, locale }: Props) {
  const panelRef = useRef<HTMLElement>(null);
  useBodyScrollLock(open);
  // The toggle button lives in the header, so outside clicks there are handled by the toggle itself.
  useDismiss(panelRef, open, (reason) => reason === "escape" && onClose());

  if (!open) return null;

  const links = [
    { label: dict.nav.home, href: "#kv", current: true },
    { label: dict.nav.store, href: goPath(locale, "store") },
    { label: dict.developerMenu[0], href: goPath(locale, "developer-released") },
    { label: dict.developerMenu[1], href: goPath(locale, "developer-test") },
    { label: dict.creator, href: goPath(locale, "creator") },
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
        </ul>
      </nav>
    </>
  );
}
