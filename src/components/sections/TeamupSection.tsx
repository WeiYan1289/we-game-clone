"use client";

import Image from "next/image";
import { useState } from "react";
import { TEAM_ROLES } from "@/data/teamup";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./TeamupSection.module.css";

/**
 * "开黑" squad picker. Avatars are native radio inputs (arrow-key navigation
 * and screen-reader semantics for free), styled as round portraits.
 */
export function TeamupSection() {
  const [selectedId, setSelectedId] = useState(TEAM_ROLES[2].id);
  const selected = TEAM_ROLES.find((r) => r.id === selectedId) ?? TEAM_ROLES[0];

  return (
    <section id="teamup" className={styles.teamup} aria-labelledby="teamup-title">
      <Image src="/images/teamup-bg.jpg" alt="" fill sizes="100vw" className={styles.bg} />

      <SectionHeading id="teamup-title" title="开黑功能 实力回归" subtitle="开黑寻友 一起好玩" />

      <div className={styles.stage} aria-live="polite">
        <Image
          key={selected.id}
          src={selected.hero}
          alt=""
          width={600}
          height={600}
          sizes="(max-width: 640px) 70vw, 420px"
          className={styles.hero}
        />
        <p className={styles.roleTag}>
          已选择 <strong>{selected.role}</strong>
        </p>
      </div>

      <fieldset className={styles.squad}>
        <legend className="visually-hidden">选择你的位置</legend>
        {TEAM_ROLES.map((r) => (
          <label key={r.id} className={styles.member} data-selected={r.id === selectedId}>
            <input
              type="radio"
              name="team-role"
              value={r.id}
              checked={r.id === selectedId}
              onChange={() => setSelectedId(r.id)}
              className="visually-hidden"
            />
            <Image src={r.avatar} alt="" width={96} height={96} className={styles.avatar} />
            <span className={styles.memberLabel}>{r.role}</span>
          </label>
        ))}
      </fieldset>

      <a href="#" className={styles.cta}>
        立即开黑
      </a>
    </section>
  );
}
