import Image from "next/image";
import { PERFORMANCE_STATS } from "@/data/features";
import { VIDEO_CDN } from "@/data/games";
import { BackgroundVideo } from "../ui/BackgroundVideo";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./FrameSection.module.css";

/** "性能升级" — client screenshot on a perspective grid, plus a live gameplay frame. */
export function FrameSection() {
  return (
    <section id="frame" className={styles.frame} aria-labelledby="frame-title">
      <div className={styles.update}>
        <SectionHeading id="frame-title" title="性能升级 轻快畅玩" />

        <dl className={styles.stats}>
          {PERFORMANCE_STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.stage}>
          <Image
            src="/images/frame-main-store.png"
            alt="WeGame 客户端商店界面"
            width={1402}
            height={800}
            sizes="(max-width: 1024px) 92vw, 960px"
            className={styles.screen}
          />
        </div>
      </div>

      <div className={styles.fast}>
        <div className={styles.fastCopy}>
          <SectionHeading align="start" eyebrow="云端加速" title="边下边玩" subtitle="大作秒开 不必等待" />
          <p className={styles.fastText}>智能分块下载，核心资源优先就绪，下载进度过半即可进入游戏。</p>
        </div>
        <div className={styles.device}>
          <Image
            src="/images/frame-video-game.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 92vw, 640px"
            className={styles.devicePoster}
          />
          <BackgroundVideo src={`${VIDEO_CDN}/frame-mingchao.69a86ede.mp4`} />
        </div>
      </div>
    </section>
  );
}
