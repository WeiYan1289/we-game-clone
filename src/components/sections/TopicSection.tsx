import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Frame, Panel } from "../paging/Panel";
import { FloatingPosters } from "./FloatingPosters";
import { RotatingPill } from "./RotatingPill";
import styles from "./TopicSection.module.css";

type Props = { locale: Locale; dict: Dictionary["topic"]; games: Dictionary["games"] };

/** "大作云集" — posters drift around the title (with mouse parallax on desktop). */
export function TopicSection({ locale, dict, games }: Props) {
  return (
    <Panel id="topic" rail={0} className={styles.topic} aria-labelledby="topic-title">
      <FloatingPosters names={games} />
      <Frame>
        <div className={styles.head}>
          <h2 id="topic-title" className={styles.title}>
            {dict.title}
          </h2>
          <p className={styles.subtitle}>{dict.subtitle}</p>
        </div>
        <RotatingPill pills={dict.pills} locale={locale} />
      </Frame>
    </Panel>
  );
}
