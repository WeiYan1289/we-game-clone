"use client";

import Image from "next/image";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { DownloadButton } from "../download/DownloadButton";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { SearchBox } from "./SearchBox";
import styles from "./Header.module.css";

type Props = {
  dict: Dictionary["header"];
  downloadDict: Dictionary["download"];
  onOpenRegion: () => void;
  /** e.g. "MYR" once a currency is known — shown on the region button. */
  regionBadge?: string;
};

/**
 * Two layouts, as on the original:
 *  - desktop: logo · nav · search … creator banner · icons · download · login
 *  - mobile: hamburger (left) · search · login — no logo; the menu drops down
 *    under the bar on a solid backdrop.
 */
export function Header({ dict, downloadDict, onOpenRegion, regionBadge }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const developerItems = dict.developerMenu.map((label) => ({ label, href: "#" }));
  const regionLabel = regionBadge ? `${dict.region}（${regionBadge}）` : dict.region;

  return (
    <header className={styles.header} data-menu-open={menuOpen}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? dict.closeMenu : dict.openMenu}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? "close" : "menu"} size={24} />
        </button>

        <a href="#kv" className={styles.brand} title={dict.homeLabel}>
          <Logo height={34} />
        </a>

        <nav className={styles.nav} aria-label={dict.homeLabel}>
          <a href="#kv" className={styles.navLink} aria-current="page">
            {dict.nav.home}
          </a>
          <a href="#topic" className={styles.navLink}>
            {dict.nav.store}
          </a>
          <NavDropdown label={dict.nav.developer} items={developerItems} />
        </nav>

        <SearchBox
          className={styles.search}
          label={dict.searchLabel}
          submitLabel={dict.searchSubmit}
          suggestions={dict.searchSuggestions}
        />

        <div className={styles.actions}>
          <a href="#college" className={styles.creator} aria-label={dict.creator}>
            <Image src="/images/creator-entry.png" alt="" width={104} height={42} />
          </a>
          <a href="#" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label={dict.recent} title={dict.recent}>
            <Icon name="clock" size={22} />
          </a>
          <a href="#" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label={dict.messages} title={dict.messages}>
            <Icon name="message" size={22} />
          </a>
          <div className={styles.desktopOnly}>
            <DownloadButton variant="header" labels={{ pc: dict.downloadClient, mac: dict.downloadMac }} dict={downloadDict} />
          </div>
          <a href="#" className={styles.login}>
            <Icon name="user" size={18} />
            {dict.login}
          </a>
          {/* Last control in the bar: top-right corner on desktop and mobile */}
          <button
            type="button"
            className={styles.region}
            onClick={onOpenRegion}
            aria-label={regionLabel}
            title={dict.region}
          >
            <Icon name="globe" size={18} />
            {regionBadge && <span>{regionBadge}</span>}
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} dict={dict} />
    </header>
  );
}
