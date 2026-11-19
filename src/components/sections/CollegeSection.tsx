import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { Frame, Panel } from "../paging/Panel";
import { ChatTicker } from "../ui/ChatTicker";
import styles from "./CollegeSection.module.css";

const FEATURE_ICONS = ["⚡", "🏛", "🏆"];

/**
 * "高校认证". Entrance: three orange arrows rise, the copy staggers up, then the
 * phone, its cards, and the mascot bouncing in with overshoot; the chat
 * ticker fades in last.
 */
export function CollegeSection({ dict }: { dict: Dictionary["college"] }) {
  return (
    <Panel id="college" rail={4} className={styles.college} aria-labelledby="college-title" mobileUnits={960}>
      <div className={styles.arrows} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Frame>
        <div className={styles.copy}>
          <h2 id="college-title" className={styles.title}>
            {dict.title}
          </h2>
          <p className={styles.subtitle}>{dict.subtitle}</p>
          <ul className={styles.features}>
            {dict.features.map((f, i) => (
              <li key={f.title} className={styles.feature} style={{ animationDelay: `${1 + i * 0.08}s` }}>
                <span className={styles.icon} aria-hidden="true">
                  {FEATURE_ICONS[i]}
                </span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.phoneWrap}>
          <div className={styles.phone}>
            <Image src="/images/college-app.jpg" alt={dict.phoneAlt} width={720} height={1293} sizes="(max-width: 1024px) 25vw, 300px" />
          </div>
          <Image src="/images/college-app-card-02.png" alt="" width={811} height={347} className={styles.cardA} aria-hidden="true" />
          <Image src="/images/college-app-card-01.png" alt="" width={798} height={453} className={styles.cardB} aria-hidden="true" />
          <Image src="/images/college-ddj.png" alt="" width={225} height={225} className={styles.mascot} aria-hidden="true" />
        </div>
      </Frame>

      <div className={styles.chat} aria-label={dict.chatLabel}>
        <ChatTicker messages={dict.chat} />
      </div>
    </Panel>
  );
}
