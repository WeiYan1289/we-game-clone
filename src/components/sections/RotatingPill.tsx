import { goPath } from "@/data/links";
import type { Locale } from "@/i18n/config";
import { Icon, type IconName } from "../ui/Icon";
import styles from "./TopicSection.module.css";

const ICONS: IconName[] = ["sparkle", "search", "flame"];

/**
 * Call-to-action whose verb cycles new → search → hot. Pure CSS: the three
 * labels share one grid cell (so the pill sizes to the longest) and each
 * slides up in, holds, and slides up out on a staggered 4.8s loop — no JS
 * timer, no re-renders.
 */
export function RotatingPill({ pills, locale }: { pills: string[]; locale: Locale }) {
  return (
    <a href={goPath(locale, "store")} className={styles.pill} aria-label={pills.join(" / ")}>
      <span className={styles.pillWords} aria-hidden="true">
        {pills.map((label, i) => (
          <span key={label} className={styles.pillWord} style={{ animationDelay: `${i * 1.6}s` }}>
            <Icon name={ICONS[i % ICONS.length]} className={styles.pillIcon} />
            {label}
          </span>
        ))}
      </span>
    </a>
  );
}
