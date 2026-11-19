import { VIDEO_CDN } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { DownloadButton } from "../download/DownloadButton";
import { Panel } from "../paging/Panel";
import { BackgroundVideo } from "../ui/BackgroundVideo";
import { Icon } from "../ui/Icon";
import styles from "./HeroSection.module.css";

type Props = { dict: Dictionary["hero"]; downloadDict: Dictionary["download"] };

/**
 * Key visual. Desktop: full-screen video, slogan, OS-aware download button.
 * Mobile (like the original): no video — the static dotted-glow artwork and
 * the slogan only, which also spares phones a 20 MB download.
 */
export function HeroSection({ dict, downloadDict }: Props) {
  return (
    <Panel id="kv" className={styles.hero} aria-labelledby="kv-title" mobileUnits={780}>
      <div className={styles.media} aria-hidden="true">
        <BackgroundVideo src={`${VIDEO_CDN}/kv.05fbf910.mp4`} minWidth={1025} />
        <div className={styles.shade} />
        <div className={styles.dots} />
      </div>

      <div className={styles.content}>
        <h1 id="kv-title" className={styles.slogan}>
          <span className={styles.streak} aria-hidden="true" />
          {dict.title}
          <span className={styles.version}>{dict.version}</span>
        </h1>
        <div className={styles.cta}>
          <DownloadButton variant="hero" labels={{ pc: dict.downloadPc, mac: dict.downloadMac }} dict={downloadDict} />
        </div>
      </div>

      <a href="#topic" className={styles.scrollCue} aria-label={dict.scrollHint}>
        <Icon name="chevronDown" size={28} />
      </a>
    </Panel>
  );
}
