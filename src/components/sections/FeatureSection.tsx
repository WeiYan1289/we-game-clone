import Image from "next/image";
import { FEATURE_ART } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { Frame, Panel } from "../paging/Panel";
import { Tabs } from "../ui/Tabs";
import styles from "./FeatureSection.module.css";

type Dict = Dictionary["feature"];

function FeaturePanel({ item, art, mirrored, screenAlt }: { item: Dict["items"][number]; art: (typeof FEATURE_ART)[number]; mirrored: boolean; screenAlt: string }) {
  return (
    <article className={styles.panel} data-mirrored={mirrored}>
      <Image src={art.bg} alt="" fill sizes="100vw" className={styles.bg} />
      <Frame>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{item.eyebrow}</p>
          <h3 className={styles.title}>{item.title}</h3>
          <ul className={styles.points}>
            {item.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className={styles.screen}>
          <Image src={art.inner.src} alt={`${item.title} ${screenAlt}`} width={art.inner.width} height={art.inner.height} sizes="(max-width: 1024px) 45vw, 620px" />
          {art.badge && <Image src={art.badge} alt="" width={210} height={300} className={styles.badge} aria-hidden="true" />}
        </div>
        <Image
          src={art.role.src}
          alt=""
          width={art.role.width}
          height={art.role.height}
          sizes="(max-width: 1024px) 50vw, 50vw"
          className={styles.role}
          aria-hidden="true"
        />
      </Frame>
    </article>
  );
}

/**
 * "助手". Desktop: one screen with three auto-rotating tabs along the bottom.
 * Mobile (like the original): an intro panel then all three panels stacked.
 */
export function FeatureSection({ dict }: { dict: Dict }) {
  const items = dict.items.map((item, i) => ({ id: `feature-${i}`, label: item.tab }));

  return (
    <Panel id="feature" rail={2} className={styles.feature} aria-label={dict.label} mobileUnits={780 * 4}>
      <Tabs
        label={dict.tabsLabel}
        items={items}
        autoAdvanceMs={6000}
        before={
          <div className={styles.guide}>
            <p className={styles.guideTitle}>{dict.guideTitle}</p>
            <p className={styles.guideSubtitle}>{dict.guideSubtitle}</p>
          </div>
        }
        panels={dict.items.map((item, i) => (
          <FeaturePanel key={item.tab} item={item} art={FEATURE_ART[i]} mirrored={i === 1} screenAlt={dict.screenAlt} />
        ))}
      />
    </Panel>
  );
}
