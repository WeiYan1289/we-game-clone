"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent, useRef } from "react";
import { POSTER_LOOP_S, POSTER_STREAM, posterSrc } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./FloatingPosters.module.css";

/**
 * Posters stream out from behind the title towards the edges, growing and
 * fading (pure CSS keyframes on transform/opacity, so it runs on the
 * compositor). Negative delays start every poster mid-flight, so the field is
 * already full when the panel appears. The whole field also leans towards the
 * pointer (two CSS variables written in rAF — no React re-render).
 */
export function FloatingPosters({ names }: { names: Dictionary["games"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();
  const stagger = POSTER_LOOP_S / POSTER_STREAM.length;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", String((e.clientX - rect.left) / rect.width - 0.5));
      el.style.setProperty("--my", String((e.clientY - rect.top) / rect.height - 0.5));
    });
  };

  return (
    <div ref={ref} className={styles.field} onPointerMove={onPointerMove}>
      <div className={styles.lean}>
        {POSTER_STREAM.map((p, i) => (
          <div
            key={p.id}
            className={styles.poster}
            style={
              {
                "--fx": p.from[0],
                "--fy": p.from[1],
                "--tx": p.to[0],
                "--ty": p.to[1],
                "--delay": `${-i * stagger}s`,
                "--loop": `${POSTER_LOOP_S}s`,
              } as CSSProperties
            }
          >
            <Image src={posterSrc(p.id)} alt={names[p.id]} fill sizes="(max-width: 1024px) 20vw, 18vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
