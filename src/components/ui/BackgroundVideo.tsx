"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./BackgroundVideo.module.css";

type Props = {
  src: string;
  /** Shown before the video loads, if it fails, or under reduced motion. */
  poster?: string;
  className?: string;
  /** Only load the video at or above this width (saves ~20 MB on phones, like the original). */
  minWidth?: number;
};

/**
 * Decorative, muted, looping video. Plays only while on screen, never under
 * reduced motion, and degrades to the section's background if the CDN fails
 * (e.g. offline — videos are hotlinked and intentionally not cached).
 */
export function BackgroundVideo({ src, poster, className, minWidth }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();
  const wideEnough = useMediaQuery(`(min-width: ${minWidth ?? 0}px)`);
  const active = !failed && (minWidth === undefined || wideEnough);

  useEffect(() => {
    const video = ref.current;
    if (!video || !active) return;
    if (reduced) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced, active]);

  if (!active) return null;

  return (
    <video
      ref={ref}
      className={`${styles.video} ${className ?? ""}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setFailed(true)}
    />
  );
}
