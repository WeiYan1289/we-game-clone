"use client";

import Image from "next/image";
import { useState } from "react";
import { TEAM_ART } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { Frame, Panel } from "../paging/Panel";
import styles from "./TeamupSection.module.css";

/**
 * "开黑" squad picker. Avatars are native radio inputs (arrow keys and screen
 * reader semantics for free); the chosen hero steps into the portal.
 */
export function TeamupSection({ dict }: { dict: Dictionary["teamup"] }) {
  const [selected, setSelected] = useState(2);
  const hero = TEAM_ART[selected];

  return (
    <Panel id="teamup" rail={3} className={styles.teamup} aria-labelledby="teamup-title" mobileUnits={1080}>
      <Image src="/images/teamup-bg.jpg" alt="" fill sizes="100vw" className={styles.bg} />
      <div className={styles.chevrons} aria-hidden="true" />
      <Frame>
        <h2 id="teamup-title" className={styles.title}>
          {dict.title}
        </h2>
        <p className={styles.subtitle}>{dict.subtitle}</p>

        <div className={styles.portal}>
          <Image key={hero.hero} src={hero.hero} alt="" width={900} height={900} sizes="(max-width: 1024px) 40vw, 480px" className={styles.hero} />
          <p className={styles.portalCaption} aria-live="polite">
            {dict.selected} <strong>{dict.roles[selected]}</strong>
          </p>
        </div>

        <fieldset className={styles.squad}>
          <legend className="visually-hidden">{dict.legend}</legend>
          {TEAM_ART.map((art, i) => (
            <label key={art.avatar} className={styles.member} data-selected={i === selected}>
              <input
                type="radio"
                name="team-role"
                value={i}
                checked={i === selected}
                onChange={() => setSelected(i)}
                className="visually-hidden"
              />
              <Image src={art.avatar} alt="" width={120} height={120} className={styles.avatar} />
              <span className={styles.role}>{dict.roles[i]}</span>
            </label>
          ))}
        </fieldset>
      </Frame>
    </Panel>
  );
}
