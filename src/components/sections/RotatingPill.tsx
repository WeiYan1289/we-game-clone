"use client";

import { useState } from "react";
import { TOPIC_PILLS } from "@/data/games";
import { useInterval } from "@/hooks/useInterval";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Icon } from "../ui/Icon";
import styles from "./TopicSection.module.css";

/** Call-to-action whose verb cycles: 尝新鲜的 → 搜想玩的 → 看热门的. */
export function RotatingPill() {
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();
  useInterval(() => setI((v) => (v + 1) % TOPIC_PILLS.length), reduced ? null : 2600);

  return (
    <a href="#topic" className={styles.pill}>
      <Icon name="search" size={18} />
      <span key={i} className={styles.pillText}>
        {TOPIC_PILLS[i]}
      </span>
    </a>
  );
}
