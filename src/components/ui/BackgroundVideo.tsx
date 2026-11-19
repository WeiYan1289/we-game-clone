"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./BackgroundVideo.module.css";

type Props = {
  src: string;
  /** Shown before the video loads, if it fails, or under reduced motion. */
  poster?: string;
  className?: string;
};

/**
 * Decorative, muted, looping video. Plays only while on screen, never under
 * reduced motion, and degrades to the poster/background if the CDN fails
 * (e.g. offline — videos are hotlinked and intentionally not cached).
 */
export function BackgroundVideo({ src, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;
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
  }, [reduced, failed]);

  if (failed) return null;

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
