"use client";

import { type CSSProperties, type KeyboardEvent, type ReactNode, useId, useRef, useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Tabs.module.css";

export type TabItem = { id: string; label: string };

type Props<T extends TabItem> = {
  items: T[];
  label: string;
  renderPanel: (item: T) => ReactNode;
  /** Rotate to the next tab automatically; pauses on hover/focus. */
  autoAdvanceMs?: number;
  className?: string;
};

/**
 * WAI-ARIA tabs with roving tabindex and automatic activation.
 * The tab bar sits under the panel (as on the live site) via CSS order;
 * DOM order keeps the tablist first for assistive tech.
 */
export function Tabs<T extends TabItem>({ items, label, renderPanel, autoAdvanceMs, className }: Props<T>) {
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

  const active = items[index];

  return (
    <div
      className={`${styles.tabs} ${className ?? ""}`}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      // Pause while keyboard focus is anywhere inside (tabs or panel), so
      // selection never moves away from where the user is.
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
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => select(i)}
            >
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.label}>{item.label}</span>
              {selected && autoplay && (
                <span
                  key={index}
                  className={styles.progress}
                  style={{ "--duration": `${autoplay}ms` } as CSSProperties}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className={styles.panel}
      >
        <div key={active.id} className={styles.panelInner}>
          {renderPanel(active)}
        </div>
      </div>
    </div>
  );
}
