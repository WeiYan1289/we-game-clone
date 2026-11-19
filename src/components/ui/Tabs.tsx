"use client";

import { type CSSProperties, type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Tabs.module.css";

export type TabItem = { id: string; label: string };

type Props = {
  items: TabItem[];
  label: string;
  /** One server-rendered panel per item. All stay mounted: mobile CSS stacks them, desktop CSS shows the active one. */
  panels: ReactNode[];
  /** Rotate to the next tab automatically; pauses on hover/focus. */
  autoAdvanceMs?: number;
  className?: string;
  /** Extra content rendered before the panels (e.g. a mobile-only intro). */
  before?: ReactNode;
};

/** WAI-ARIA tabs with roving tabindex, automatic activation and optional auto-advance. */
export function Tabs({ items, label, panels, autoAdvanceMs, className, before }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const autoplay = autoAdvanceMs && !paused && !reduced ? autoAdvanceMs : null;

  const select = (i: number, focus = false) => {
    const next = (i + items.length) % items.length;
    setIndex(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  useInterval(() => select(index + 1), autoplay);

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: items.length - 1 };
    if (!(e.key in moves)) return;
    e.preventDefault();
    select(moves[e.key], true);
  };

  return (
    <div
      className={`${styles.tabs} ${className ?? ""}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      // Pause while keyboard focus is anywhere inside, so selection never moves away from the user.
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div role="tablist" aria-label={label} className={styles.list} onKeyDown={onKeyDown}>
        {items.map((item, i) => {
          const selected = i === index;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => select(i)}
            >
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.label}>{item.label}</span>
              {selected && autoplay && (
                <span key={index} className={styles.progress} style={{ "--duration": `${autoplay}ms` } as CSSProperties} aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.panels}>
        {before}
        {items.map((item, i) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-panel-${item.id}`}
            aria-labelledby={`${baseId}-tab-${item.id}`}
            className={styles.panel}
            data-active={i === index}
          >
            {panels[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
