"use client";

import { useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Icon, type IconName } from "../ui/Icon";
import styles from "./TopicSection.module.css";

const ICONS: IconName[] = ["sparkle", "search", "flame"];

/** Call-to-action that cycles its verb and icon: new → search → hot. */
export function RotatingPill({ pills }: { pills: string[] }) {
  const [i, setI] = useState(0);
  const reduced = usePrefersReducedMotion();
  useInterval(() => setI((v) => (v + 1) % pills.length), reduced ? null : 2600);

  return (
    <a href="#topic" className={styles.pill}>
      <Icon name={ICONS[i % ICONS.length]} className={styles.pillIcon} />
      <span key={i} className={styles.pillText} aria-live="polite">
        {pills[i]}
      </span>
    </a>
  );
}
