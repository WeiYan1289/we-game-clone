"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent, useRef } from "react";
import { FLOATING_POSTERS, posterSrc } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./FloatingPosters.module.css";

/**
 * Posters scattered on the 1440×900 frame. They bob gently, fly in when the
 * panel becomes current, and shift with the pointer by their `depth`
 * (writes two CSS variables per frame — no React re-render on mousemove).
 */
export function FloatingPosters({ names }: { names: Dictionary["games"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reduced = usePrefersReducedMotion();

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
      {FLOATING_POSTERS.map((p, i) => (
        <div
          key={p.id}
          className={styles.poster}
          style={
            {
              "--x": p.x,
              "--y": p.y,
              "--w": p.w,
              "--depth": p.depth,
              "--delay": `${i * 70}ms`,
              "--bob-delay": `${i * -1.1}s`,
            } as CSSProperties
          }
        >
          <Image src={posterSrc(p.id)} alt={names[p.id]} fill sizes="(max-width: 1024px) 15vw, 14vw" />
        </div>
      ))}
    </div>
  );
}
