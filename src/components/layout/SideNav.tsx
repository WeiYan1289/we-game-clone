"use client";

import { SECTIONS } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { Icon } from "../ui/Icon";
import styles from "./SideNav.module.css";

const IDS = SECTIONS.map((s) => s.id);

/** Desktop section indicator (right edge) plus a back-to-top button. */
export function SideNav() {
  const active = useActiveSection(IDS);
  const pastHero = useScrolled(600);

  return (
    <>
      <nav className={styles.rail} aria-label="页面分区">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={styles.dot}
                aria-current={active === s.id ? "true" : undefined}
              >
                <span className={styles.label}>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a href="#kv" className={styles.toTop} data-visible={pastHero} aria-label="回到顶部" tabIndex={pastHero ? 0 : -1}>
        <Icon name="arrowUp" size={18} />
      </a>
    </>
  );
}
