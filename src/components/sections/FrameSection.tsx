import Image from "next/image";
import { VIDEO_CDN } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { Frame, Panel } from "../paging/Panel";
import { BackgroundVideo } from "../ui/BackgroundVideo";
import styles from "./FrameSection.module.css";

/**
 * "焕新" — two steps under one rail entry, as on the live site:
 *  1. WEGAME 3.0 update: the client window rises in, a light line opens above
 *     it and a refresh glow sweeps up the screen while the title settles.
 *  2. Performance: the screen snaps back into perspective, then speed lines
 *     sweep up the grid on a loop.
 */
export function FrameSection({ dict }: { dict: Dictionary["frame"] }) {
  return (
    <>
      <Panel id="frame" rail={1} className={styles.update} aria-labelledby="frame-title">
        <div className={styles.media} aria-hidden="true">
          <BackgroundVideo src={`${VIDEO_CDN}/frame-mingchao.69a86ede.mp4`} minWidth={1025} className={styles.video} />
        </div>
        <Frame>
          <h2 id="frame-title" className={styles.updateTitle}>
            {dict.updateTitle}
          </h2>
          <p className={styles.updateSubtitle}>{dict.updateSubtitle}</p>
          <div className={styles.lightLine} aria-hidden="true" />
          <div className={styles.stage}>
            <div className={styles.refresh} aria-hidden="true" />
            <Image
              src="/images/frame-main-store.png"
              alt={dict.updateAlt}
              width={1402}
              height={800}
              sizes="(max-width: 1024px) 80vw, 1000px"
              className={styles.screen}
            />
          </div>
        </Frame>
      </Panel>

      <Panel id="frame-fast" rail={1} className={styles.fast} aria-labelledby="frame-fast-title">
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.speed} aria-hidden="true" />
        <Frame>
          <h2 id="frame-fast-title" className={styles.fastTitle}>
            {dict.fastTitle}
          </h2>
          <dl className={styles.stats}>
            {dict.stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.stage}>
            <Image
              src="/images/frame-video-game.jpg"
              alt={dict.fastAlt}
              width={1374}
              height={773}
              sizes="(max-width: 1024px) 80vw, 1000px"
              className={`${styles.screen} ${styles.screenFast}`}
            />
          </div>
        </Frame>
      </Panel>
    </>
  );
}
