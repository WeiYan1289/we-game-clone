import { VIDEO_CDN } from "@/data/games";
import { BackgroundVideo } from "../ui/BackgroundVideo";
import { Icon } from "../ui/Icon";
import styles from "./HeroSection.module.css";

/** Key visual: full-viewport video with the "轻装上阵 3.0" slogan. */
export function HeroSection() {
  return (
    <section id="kv" className={styles.hero} aria-labelledby="kv-title">
      <div className={styles.media} aria-hidden="true">
        <BackgroundVideo src={`${VIDEO_CDN}/kv.05fbf910.mp4`} />
        <div className={styles.code} />
        <div className={styles.shade} />
      </div>

      <div className={styles.content}>
        <h1 id="kv-title" className={styles.slogan}>
          轻装上阵<span className={styles.version}>3.0</span>
        </h1>
        <p className={styles.tagline}>更轻、更快、更好玩的游戏平台</p>
        <div className={styles.ctas}>
          <a href="#" className={styles.primary}>
            <Icon name="download" size={18} />
            下载 Mac 端
          </a>
          <a href="#" className={styles.secondary}>
            <Icon name="windows" size={16} />
            Windows 版
          </a>
        </div>
      </div>

      <a href="#topic" className={styles.scrollCue} aria-label="向下滚动">
        <Icon name="chevronDown" size={28} />
      </a>
    </section>
  );
}
