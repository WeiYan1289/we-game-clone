"use client";

import Image from "next/image";
import { useState } from "react";
import { DEVELOPER_MENU, PRIMARY_NAV } from "@/data/navigation";
import { useScrolled } from "@/hooks/useScrolled";
import { Icon } from "../ui/Icon";
import { Logo } from "../ui/Logo";
import { MobileNav } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";
import { SearchBox } from "./SearchBox";
import styles from "./Header.module.css";

type Props = { onOpenCurrency: () => void };

/**
 * Sticky site header. Transparent over the hero, solid once scrolled.
 * Desktop shows full nav; tablet/mobile collapse into a drawer.
 */
export function Header({ onOpenCurrency }: Props) {
  const scrolled = useScrolled();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className={styles.header} data-scrolled={scrolled}>
      <div className={styles.inner}>
        <a href="#kv" className={styles.brand} aria-label="WeGame 首页">
          <Logo />
        </a>

        <nav className={styles.nav} aria-label="主导航">
          {PRIMARY_NAV.map((link, i) => (
            <a key={link.label} href={link.href} className={styles.navLink} aria-current={i === 0 ? "page" : undefined}>
              {link.label}
            </a>
          ))}
          <NavDropdown label="开发者平台" items={DEVELOPER_MENU} />
        </nav>

        <SearchBox className={styles.search} />

        <div className={styles.actions}>
          <a href="#college" className={styles.creator} aria-label="视频创作者招募计划">
            <Image src="/images/creator-entry.png" alt="" width={104} height={42} />
          </a>
          <button type="button" className={styles.iconBtn} onClick={onOpenCurrency} aria-label="地区与货币">
            <Icon name="globe" />
          </button>
          <a href="#" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="最近玩过">
            <Icon name="clock" />
          </a>
          <a href="#" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="消息">
            <Icon name="message" />
          </a>
          <a href="#" className={`${styles.pillBtn} ${styles.desktopOnly}`}>
            <Icon name="download" size={16} />
            下载 Mac 版
          </a>
          <a href="#" className={`${styles.pillBtn} ${styles.desktopOnly}`}>
            <Icon name="user" size={16} />
            登录
          </a>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            aria-label="打开菜单"
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav"
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      <MobileNav open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
