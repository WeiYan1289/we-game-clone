"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent, useRef, useState } from "react";
import type { Game } from "@/data/games";
import { useInterval } from "@/hooks/useInterval";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Icon } from "./Icon";
import styles from "./PosterCarousel.module.css";

type Props = {
  items: Game[];
  /** Auto-advance interval; omit to disable. */
  autoplayMs?: number;
  label?: string;
};

const SWIPE_THRESHOLD = 40;

/**
 * Centred "coverflow" carousel. The active poster is centred and enlarged;
 * the rest fan out to each side. Index wraps at both ends.
 * Visible count per breakpoint is a CSS concern (--per-view).
 */
export function PosterCarousel({ items, autoplayMs, label = "热门游戏" }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const swipeStart = useRef<number | null>(null);
  const count = items.length;

  const go = (i: number) => setIndex(((i % count) + count) % count);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useInterval(next, autoplayMs && !paused && !reduced ? autoplayMs : null);

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) (dx < 0 ? next : prev)();
  };

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.viewport} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <ul className={styles.track} style={{ "--index": index } as CSSProperties} aria-live={paused ? "polite" : "off"}>
          {items.map((game, i) => {
            const offset = i - index;
            return (
              <li
                key={game.id}
                className={styles.slide}
                data-active={offset === 0}
                style={{ "--offset": Math.min(Math.abs(offset), 3) } as CSSProperties}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${count}`}
                aria-hidden={offset !== 0}
                onClick={() => offset !== 0 && go(i)}
              >
                <Image
                  src={game.poster}
                  alt={game.name}
                  width={380}
                  height={500}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
                  className={styles.poster}
                  draggable={false}
                />
                <span className={styles.caption}>{game.name}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={prev} aria-label="上一个">
          <Icon name="chevronLeft" />
        </button>
        <div className={styles.dots}>
          {items.map((game, i) => (
            <button
              key={game.id}
              type="button"
              className={styles.dot}
              aria-label={`第 ${i + 1} 张：${game.name}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className={styles.arrow} onClick={next} aria-label="下一个">
          <Icon name="chevronRight" />
        </button>
      </div>
    </section>
  );
}
