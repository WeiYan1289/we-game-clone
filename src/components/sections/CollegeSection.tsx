import Image from "next/image";
import { CHAT_MESSAGES, COLLEGE_FEATURES } from "@/data/teamup";
import { ChatTicker } from "../ui/ChatTicker";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./CollegeSection.module.css";

/** "高校认证" — feature list beside a phone mock, with a live-chat style ticker. */
export function CollegeSection() {
  return (
    <section id="college" className={styles.college} aria-labelledby="college-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <SectionHeading id="college-title" align="start" title="WEGAME 高校认证" subtitle="同校同好 为你而聚" />
          <ul className={styles.features}>
            {COLLEGE_FEATURES.map((f) => (
              <li key={f.title} className={styles.feature}>
                <span className={styles.icon} aria-hidden="true">
                  {f.icon}
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
            <Image
              src="/images/college-app.jpg"
              alt="WeGame 高校认证 App 界面"
              width={720}
              height={1293}
              sizes="(max-width: 640px) 60vw, 280px"
            />
          </div>
          <Image src="/images/college-app-card-02.png" alt="" width={811} height={347} className={styles.cardA} aria-hidden="true" />
          <Image src="/images/college-app-card-01.png" alt="" width={798} height={453} className={styles.cardB} aria-hidden="true" />
          <Image src="/images/college-ddj.png" alt="" width={225} height={225} className={styles.mascot} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.chat} aria-label="校友动态">
        <ChatTicker messages={CHAT_MESSAGES} />
        <ChatTicker messages={[...CHAT_MESSAGES].reverse()} reverse />
      </div>
    </section>
  );
}
