"use client";

import { useRef } from "react";
import { DEVELOPER_MENU, SECTIONS } from "@/data/navigation";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useDismiss } from "@/hooks/useDismiss";
import { Icon } from "../ui/Icon";
import { SearchBox } from "./SearchBox";
import styles from "./MobileNav.module.css";

type Props = { open: boolean; onClose: () => void };

/** Slide-in drawer for tablet/mobile. Rendered only while open. */
export function MobileNav({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(open);
  useDismiss(panelRef, open, onClose);

  if (!open) return null;

  return (
    <div className={styles.backdrop}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="主菜单"
        id="mobile-nav"
      >
        <div className={styles.head}>
          <span className={styles.title}>菜单</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="关闭菜单" autoFocus>
            <Icon name="close" />
          </button>
        </div>

        <SearchBox className={styles.search} />

        <nav aria-label="页面导航">
          <ul className={styles.list}>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={styles.link} onClick={onClose}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.groupLabel}>开发者平台</p>
        <ul className={styles.list}>
          {DEVELOPER_MENU.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={styles.subLink} onClick={onClose}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <a href="#" className={styles.primary}>
            <Icon name="download" size={18} />
            下载客户端
          </a>
          <a href="#" className={styles.secondary}>
            <Icon name="user" size={18} />
            登录
          </a>
        </div>
      </div>
    </div>
  );
}
