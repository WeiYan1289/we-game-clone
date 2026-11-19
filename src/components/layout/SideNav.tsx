"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { useScrolled } from "@/hooks/useScrolled";
import { usePaging } from "../paging/FullPage";
import { Icon } from "../ui/Icon";
import styles from "./SideNav.module.css";

/**
 * Desktop: the original's right-hand rail — "01 … 05", with the current
 * section's name spelled out — plus TOP. Hidden on the hero panel.
 * Mobile (normal scrolling): a floating back-to-top button instead.
 */
export function SideNav({ dict }: { dict: Dictionary["rail"] }) {
  const { enabled, index, rail, goToRail, goTo } = usePaging();
  const pastHero = useScrolled(600);

  if (!enabled) {
    return (
      <a href="#kv" className={styles.toTop} data-visible={pastHero} aria-label={dict.topLabel} tabIndex={pastHero ? 0 : -1}>
        <Icon name="arrowUp" size={18} />
      </a>
    );
  }

  return (
    <nav className={styles.rail} aria-label={dict.label} data-visible={index > 0}>
      <ol className={styles.list}>
        {dict.sections.map((label, i) => {
          const current = rail === i;
          return (
            <li key={label}>
              <button
                type="button"
                className={styles.item}
                aria-current={current ? "step" : undefined}
                aria-label={`${String(i + 1).padStart(2, "0")} ${label}`}
                onClick={() => goToRail(i)}
              >
                {current ? label : String(i + 1).padStart(2, "0")}
              </button>
            </li>
          );
        })}
      </ol>
      <button type="button" className={styles.top} onClick={() => goTo(0)} aria-label={dict.topLabel}>
        <Icon name="arrowUp" size={14} />
        {dict.top}
      </button>
    </nav>
  );
}
