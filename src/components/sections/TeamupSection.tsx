"use client";

import Image from "next/image";
import { type CSSProperties, useState } from "react";
import { TEAM_ART } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { Panel } from "../paging/Panel";
import styles from "./TeamupSection.module.css";

/** Stagger from the centre outwards, as on the original (outer members last). */
const STAGGER = [0.15, 0.1, 0, 0.1, 0.15];

/**
 * "开黑" — a two-act entrance, like the original:
 *   Act 1 (0–1.9s): title rises, chevrons sweep up, the five avatars rise in
 *   a centre-out wave… then leave upward.
 *   Act 2 (from 1.6s): the "游戏内外互通" room fades in and the five heroes
 *   rise into it. Heroes are a native radio group (pick your role).
 * Mobile shows both acts stacked, as the original's two sub-panels.
 */
export function TeamupSection({ dict }: { dict: Dictionary["teamup"] }) {
  const [selected, setSelected] = useState(2);

  return (
    <Panel id="teamup" rail={3} className={styles.teamup} aria-labelledby="teamup-title" mobileUnits={1560}>
      {/* ---------- Act 1 ---------- */}
      <div className={styles.act1}>
        <div className={styles.chevrons} aria-hidden="true">
          <span />
          <span />
        </div>
        <div className={styles.stage}>
          <h2 id="teamup-title" className={styles.title}>
            {dict.title}
          </h2>
          <p className={styles.subtitle}>{dict.subtitle}</p>
          <ul className={styles.members} aria-hidden="true">
            {TEAM_ART.map((art, i) => (
              <li key={art.avatar} className={styles.member} style={{ "--stagger": `${STAGGER[i]}s` } as CSSProperties} data-center={i === 2}>
                <Image src={art.avatar} alt="" width={140} height={140} className={styles.avatar} />
                <span className={styles.memberRole}>{dict.roles[i]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- Act 2 ---------- */}
      <div className={styles.act2}>
        <Image src="/images/teamup-bg.jpg" alt="" fill sizes="100vw" className={styles.room} />
        <div className={styles.stage}>
          <p className={styles.portalTitle}>{dict.portalTitle}</p>
          <p className={styles.portalSubtitle}>{dict.portalSubtitle}</p>

          <fieldset className={styles.heroes}>
            <legend className="visually-hidden">{dict.legend}</legend>
            {TEAM_ART.map((art, i) => (
              <label
                key={art.hero}
                className={styles.hero}
                data-selected={i === selected}
                style={{ "--stagger": `${STAGGER[i]}s` } as CSSProperties}
              >
                <input
                  type="radio"
                  name="team-role"
                  value={i}
                  checked={i === selected}
                  onChange={() => setSelected(i)}
                  className="visually-hidden"
                />
                <Image src={art.hero} alt="" width={600} height={600} sizes="(max-width: 1024px) 25vw, 330px" className={styles.heroImg} />
                <span className={styles.heroRole}>{dict.roles[i]}</span>
              </label>
            ))}
          </fieldset>

          <p className={styles.caption} aria-live="polite">
            {dict.selected} <strong>{dict.roles[selected]}</strong>
          </p>
        </div>
      </div>
    </Panel>
  );
}
