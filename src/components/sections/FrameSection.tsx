import Image from "next/image";
import { VIDEO_CDN } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { Frame, Panel } from "../paging/Panel";
import { BackgroundVideo } from "../ui/BackgroundVideo";
import styles from "./FrameSection.module.css";

type Dict = Dictionary["frame"];

/** "WEGAME 3.0 轻装上阵" with the version number marked so it can turn gold. */
function VersionTitle({ title, version }: { title: string; version: string }) {
  const at = title.indexOf(version);
  if (at < 0) return title;
  return (
    <>
      {title.slice(0, at)}
      <span className={styles.version}>{version}</span>
      {title.slice(at + version.length)}
    </>
  );
}

/**
 * Behind both steps (desktop): the site background, a glowing roof-line and a
 * dark floor receding in perspective. `fast` adds the code pattern and the
 * light sweeping up the floor. Phones use the original's flat artwork instead.
 */
function Backdrop({ fast }: { fast?: boolean }) {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.floor}>
        <div className={styles.floorWrap}>{fast && <div className={styles.floorLines} />}</div>
      </div>
    </div>
  );
}

/** The light bar and code rain that open above the client window. */
function LightBox() {
  return (
    <div className={styles.lightbox} aria-hidden="true">
      <span className={styles.light} />
      <span className={styles.code} />
    </div>
  );
}

/**
 * "焕新": two steps under one rail entry, as on the live site.
 *  1. The client window rises in while its sidebar and search slide into
 *     place and a refresh glow sweeps over it; "3.0" turns gold. At 2s the
 *     title changes to "体验革新 轻松掌控" and the client switches to its
 *     compact layout (the sidebar folds away, the store slides over).
 *  2. "性能升级 轻快畅玩": the window, now playing a game, tips back into
 *     perspective and light runs up the floor.
 */
export function FrameSection({ dict }: { dict: Dict }) {
  return (
    <>
      <Panel id="frame" rail={1} className={styles.update} aria-labelledby="frame-title">
        <Backdrop />
        <Frame>
          <h2 id="frame-title" className={`${styles.title} ${styles.titleUpdate}`}>
            <VersionTitle title={dict.updateTitle} version={dict.version} />
            {/* The same line again, revealed bottom-up over the white one, with only the version visible */}
            <span className={styles.titleGold} aria-hidden="true">
              <VersionTitle title={dict.updateTitle} version={dict.version} />
            </span>
          </h2>
          <p className={`${styles.title} ${styles.titleNew}`}>{dict.newTitle}</p>

          <div className={styles.block}>
            <div className={styles.refresh} aria-hidden="true" />
            <LightBox />
            <div className={styles.main}>
              <Image
                src="/images/frame-main-store.png"
                alt={dict.updateAlt}
                fill
                sizes="(max-width: 1024px) 70vw, 66vw"
                className={styles.storeOn}
              />
              <Image src="/images/frame-main-store-off.png" alt="" fill sizes="(max-width: 1024px) 70vw, 66vw" className={styles.storeOff} />
              <Image
                src="/images/frame-main-store-block.png"
                alt=""
                width={1536}
                height={1292}
                sizes="(max-width: 1024px) 50vw, 48vw"
                className={styles.storeBlock}
              />
              <span className={styles.search} aria-hidden="true" />
              <span className={styles.sidebarKey} aria-hidden="true" />
              <span className={styles.sidebarGame} aria-hidden="true" />
            </div>
          </div>
        </Frame>
      </Panel>

      <Panel id="frame-fast" rail={1} className={styles.fast} aria-labelledby="frame-fast-title">
        <Backdrop fast />
        <Frame>
          <h2 id="frame-fast-title" className={`${styles.title} ${styles.titleFast}`}>
            {dict.fastTitle}
          </h2>
          <div className={`${styles.block} ${styles.blockFast}`}>
            <dl className={styles.stats}>
              {dict.stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            <LightBox />
            <div className={styles.main}>
              <div className={styles.screen}>
                <Image src="/images/frame-video-game.jpg" alt={dict.fastAlt} fill sizes="66vw" />
                <BackgroundVideo src={`${VIDEO_CDN}/frame-mingchao.69a86ede.mp4`} minWidth={1025} className={styles.video} />
              </div>
            </div>
          </div>
        </Frame>
      </Panel>
    </>
  );
}
