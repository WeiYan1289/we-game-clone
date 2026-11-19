"use client";

import Image from "next/image";
import { type Feature, FEATURES } from "@/data/features";
import { SectionHeading } from "../ui/SectionHeading";
import { Tabs } from "../ui/Tabs";
import styles from "./FeatureSection.module.css";

function FeaturePanel({ feature }: { feature: Feature }) {
  return (
    <article className={styles.panel}>
      <Image src={feature.bg} alt="" fill sizes="100vw" className={styles.bg} />

      <div className={styles.copy}>
        <SectionHeading align="start" eyebrow={feature.eyebrow} title={feature.title} />
        <p className={styles.desc}>{feature.description}</p>
        <div className={styles.screen}>
          <Image
            src={feature.inner.src}
            alt={`${feature.title}功能界面`}
            width={feature.inner.width}
            height={feature.inner.height}
            sizes="(max-width: 1024px) 90vw, 560px"
          />
          {feature.badge && (
            <Image src={feature.badge} alt="" width={120} height={171} className={styles.badge} aria-hidden="true" />
          )}
        </div>
      </div>

      <Image
        src={feature.role.src}
        alt=""
        width={feature.role.width}
        height={feature.role.height}
        sizes="(max-width: 1024px) 80vw, 50vw"
        className={styles.role}
        aria-hidden="true"
      />
    </article>
  );
}

/** Game assistant showcase — three tabbed panels that auto-rotate. */
export function FeatureSection() {
  return (
    <section id="feature" className={styles.feature} aria-label="游戏助手">
      <Tabs
        label="游戏助手功能"
        items={FEATURES}
        autoAdvanceMs={6000}
        className={styles.tabs}
        renderPanel={(f) => <FeaturePanel feature={f} />}
      />
    </section>
  );
}
