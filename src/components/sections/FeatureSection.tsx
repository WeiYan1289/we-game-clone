import Image from "next/image";
import { type AiFeatureArt, FEATURE_ART, type GameFeatureArt } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { Frame, Panel } from "../paging/Panel";
import { FeatureTabs } from "./FeatureTabs";
import styles from "./FeatureSection.module.css";

type Dict = Dictionary["feature"];
type Item = Dict["items"][number];

/** Titles may carry a line break for the layout; alt text wants one line. */
const altFor = (item: Item, screenAlt: string) => `${item.title.replace(/\s+/g, " ")} ${screenAlt}`;

/** Full-bleed background plus its texture layer, which slides in from the art's side. */
function Backdrop({ bg, texture }: { bg: string; texture: string }) {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <Image src={bg} alt="" fill sizes="100vw" className={styles.bg} />
      <Image src={texture} alt="" fill sizes="100vw" className={styles.texture} />
    </div>
  );
}

function Heading({ item }: { item: Item }) {
  return (
    <>
      <p className={styles.eyebrow}>{item.eyebrow}</p>
      <h3 className={styles.title}>{item.title}</h3>
    </>
  );
}

/** VALORANT / League: character art beside a screenshot of the in-client tool. */
function GamePanel({ item, art, screenAlt }: { item: Item; art: GameFeatureArt; screenAlt: string }) {
  return (
    <article className={styles.panel} data-layout={art.layout}>
      <Backdrop bg={art.bg} texture={art.texture} />
      <Frame>
        <Image
          src={art.role.src}
          alt=""
          width={art.role.width}
          height={art.role.height}
          sizes="(max-width: 1024px) 80vw, 80vw"
          className={styles.role}
          aria-hidden="true"
        />
        <div className={styles.copy}>
          <Heading item={item} />
          <Image
            src={art.inner.src}
            alt={altFor(item, screenAlt)}
            width={art.inner.width}
            height={art.inner.height}
            sizes="(max-width: 1024px) 50vw, 50vw"
            className={styles.inner}
          />
        </div>
      </Frame>
    </article>
  );
}

/** AI assistant: a match-recap panel that types itself out, watched over by the sphere mascot. */
function AiPanel({ item, art, points, screenAlt }: { item: Item; art: AiFeatureArt; points: readonly string[]; screenAlt: string }) {
  return (
    <article className={styles.panel} data-layout="ai">
      <Backdrop bg={art.bg} texture={art.texture} />
      <Frame>
        <div className={styles.aiPanel}>
          <span className={styles.aiAvatar} aria-hidden="true">
            <Image src={art.avatar} alt="" fill sizes="20vw" />
            <Image src={art.lights} alt="" fill sizes="20vw" className={styles.aiLights} />
          </span>
          <Image src={art.panel.hd.src} alt="" width={art.panel.hd.width} height={art.panel.hd.height} className={styles.aiHd} aria-hidden="true" />
          <Image src={art.panel.bd} alt="" fill sizes="45vw" className={styles.aiBody} aria-hidden="true" />
          <div className={styles.aiText}>
            <Image src={art.panel.text} alt={altFor(item, screenAlt)} width={761} height={757} sizes="(max-width: 1024px) 40vw, 40vw" />
          </div>
        </div>
        <div className={styles.copy}>
          <Heading item={item} />
          <ul className={styles.aiPoints}>
            {points.map((point, i) => (
              <li key={point}>
                <Image src={art.icons[i]} alt="" width={64} height={64} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </Frame>
    </article>
  );
}

/**
 * "游戏内外 / 全面助力": a radial-gradient wedge cut on a diagonal, two chevron
 * stripes and the two titles. Desktop plays it as an overlay on arrival; mobile
 * shows it at rest as the section's first panel.
 */
function Guide({ dict, className, decorative }: { dict: Dict; className: string; decorative?: boolean }) {
  return (
    <div className={className} aria-hidden={decorative || undefined}>
      <div className={styles.guideWedge}>
        <span />
      </div>
      <div className={styles.guideArrow} data-side="left">
        <span />
      </div>
      <div className={styles.guideArrow} data-side="right">
        <span />
      </div>
      <p className={styles.guideTitle}>{dict.guideTitle}</p>
      <p className={styles.guideSubtitle}>{dict.guideSubtitle}</p>
    </div>
  );
}

/**
 * "助手". Desktop: on arrival the guide wipes in and out, then the first tab's
 * art slides in from its side; three auto-rotating tabs run along the bottom.
 * Mobile (like the original): the guide as a panel, then all three stacked.
 */
export function FeatureSection({ dict }: { dict: Dict }) {
  const items = dict.items.map((item, i) => ({ id: `feature-${i}`, label: item.tab }));

  return (
    <Panel id="feature" rail={2} className={styles.feature} aria-label={dict.label} mobileUnits={780 * 4}>
      <Guide dict={dict} className={styles.intro} decorative />
      <FeatureTabs
        rail={2}
        className={styles.tabs}
        label={dict.tabsLabel}
        items={items}
        autoAdvanceMs={6000}
        before={<Guide dict={dict} className={styles.guide} />}
        panels={dict.items.map((item, i) => {
          const art = FEATURE_ART[i];
          return art.kind === "ai" ? (
            <AiPanel key={item.tab} item={item} art={art} points={dict.aiPoints} screenAlt={dict.screenAlt} />
          ) : (
            <GamePanel key={item.tab} item={item} art={art} screenAlt={dict.screenAlt} />
          );
        })}
      />
    </Panel>
  );
}
