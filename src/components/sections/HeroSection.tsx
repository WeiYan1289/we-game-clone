import Image from "next/image";
import { VIDEO_CDN } from "@/data/games";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { DownloadButton } from "../download/DownloadButton";
import { Panel } from "../paging/Panel";
import { BackgroundVideo } from "../ui/BackgroundVideo";
import { Icon } from "../ui/Icon";
import styles from "./HeroSection.module.css";

/** The version the slogan "upgrades" from during the entrance. */
const PREVIOUS_VERSION = "2.0";

type Props = { locale: Locale; dict: Dictionary["hero"]; downloadDict: Dictionary["download"] };

/**
 * Key visual. Entrance (each time the panel becomes current): the orange
 * light box drops in from above, the slogan rises, and its version badge
 * upgrades 2.0 → 3.0 — then the download button arrives.
 * Mobile (like the original): no video, static artwork and slogan only.
 */
export function HeroSection({ locale, dict, downloadDict }: Props) {
  return (
    <Panel id="kv" className={styles.hero} aria-labelledby="kv-title" mobileUnits={780}>
      <div className={styles.media} aria-hidden="true">
        <BackgroundVideo src={`${VIDEO_CDN}/kv.05fbf910.mp4`} minWidth={1025} />
        <div className={styles.shade} />
        <div className={styles.code} />
        <div className={styles.dots} />
      </div>

      <div className={styles.content}>
        {locale === "zh-CN" ? (
          /* Chinese uses the original's slogan artwork: the 2.0 slogan hands over to 3.0 */
          <h1 id="kv-title" className={styles.sloganArt}>
            <Image src="/images/slogan-2.0.svg" alt="" width={1024} height={160} loading="eager" className={styles.artOld} aria-hidden="true" />
            <Image
              src="/images/slogan-3.0.svg"
              alt={`${dict.title} ${dict.version}`}
              width={1024}
              height={160}
              loading="eager"
              fetchPriority="high"
              className={styles.artNew}
            />
          </h1>
        ) : (
          <h1 id="kv-title" className={styles.slogan}>
            <span className={styles.streak} aria-hidden="true" />
            {dict.title}
            <span className={styles.version}>
              <span className={styles.versionOld} aria-hidden="true">
                {PREVIOUS_VERSION}
              </span>
              <span className={styles.versionNew}>{dict.version}</span>
            </span>
          </h1>
        )}
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
