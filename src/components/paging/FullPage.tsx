"use client";

import { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { createWheelGate, stepIndex } from "@/lib/paging";
import styles from "./FullPage.module.css";

/** Same conditions as the CSS: wide enough for the desktop layout, tall enough to page. */
export const PAGING_QUERY = "(min-width: 1025px) and (min-height: 560px)";

type Paging = {
  /** True when desktop paging is active (otherwise the page scrolls normally). */
  enabled: boolean;
  index: number;
  /** Rail group of the current panel (data-rail), or null. */
  rail: number | null;
  goTo: (index: number) => void;
  goToRail: (rail: number) => void;
};

const PagingContext = createContext<Paging>({
  enabled: false,
  index: 0,
  rail: null,
  goTo: () => {},
  goToRail: () => {},
});

export const usePaging = () => useContext(PagingContext);

const isTypingTarget = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const overlayOpen = () => !!document.querySelector("dialog[open], [data-overlay-open]");

/**
 * Desktop "full-page" navigation like the original site: no free scrolling,
 * the wheel / keys / swipes / side rail move one panel at a time with a slide
 * transition. Panels are the [data-panel] elements among `children`.
 *
 * Keyboard and screen-reader users are covered: focusing anything inside an
 * off-screen panel brings that panel into view, and in-page anchor links are
 * routed to the right panel.
 *
 * `overlay` (e.g. the side rail) shares the paging context but renders outside
 * the transformed track, where `position: fixed` still works.
 */
export function FullPage({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  const enabled = useMediaQuery(PAGING_QUERY);
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLElement[]>([]);
  const [layout, setLayout] = useState<{ offsets: number[]; rails: (number | null)[] }>({ offsets: [0], rails: [null] });
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const panelIndexOf = (el: Element | null) => {
    const panel = el?.closest<HTMLElement>("[data-panel]");
    return panel ? panelsRef.current.indexOf(panel) : -1;
  };

  const goTo = useCallback((next: number) => {
    const count = panelsRef.current.length;
    if (!count) return;
    const clamped = Math.min(count - 1, Math.max(0, next));
    indexRef.current = clamped;
    setIndex(clamped);
  }, []);

  const goToRail = useCallback(
    (rail: number) => {
      const target = panelsRef.current.findIndex((p) => p.dataset.rail === String(rail));
      if (target >= 0) goTo(target);
    },
    [goTo],
  );

  // Measure panel positions (and re-measure on resize / content changes).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      panelsRef.current = Array.from(track.querySelectorAll<HTMLElement>("[data-panel]"));
      const max = Math.max(0, track.scrollHeight - window.innerHeight);
      setLayout({
        offsets: panelsRef.current.map((p) => Math.min(p.offsetTop, max)),
        rails: panelsRef.current.map((p) => (p.dataset.rail === undefined ? null : Number(p.dataset.rail))),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Tell CSS which mode we are in (scroll locking lives in FullPage.module.css).
  useEffect(() => {
    document.documentElement.dataset.paging = enabled ? "on" : "off";
    if (!enabled) return;
    // Entering paging mode: a deep link (/#feature) wins; otherwise keep the
    // panel the user had scrolled to (e.g. after resizing from mobile width).
    const fromHash = panelIndexOf(document.getElementById(decodeURIComponent(window.location.hash.slice(1))));
    const y = window.scrollY;
    const nearest = panelsRef.current.findIndex((p) => p.offsetTop + p.offsetHeight / 2 > y);
    window.scrollTo(0, 0);
    goTo(fromHash >= 0 ? fromHash : Math.max(0, nearest));
  }, [enabled, goTo]);

  // Mark the current panel so sections can play their enter animations.
  useEffect(() => {
    panelsRef.current.forEach((p, i) => p.toggleAttribute("data-current", !enabled || i === index));
  }, [index, enabled, layout]);

  // Input: wheel, keyboard, touch, focus and anchor links.
  useEffect(() => {
    if (!enabled) return;
    const step = (dir: -1 | 1) => goTo(stepIndex(indexRef.current, dir, panelsRef.current.length));
    const gate = createWheelGate({ lockMs: 900, quietMs: 160, minDelta: 6 });

    const onWheel = (e: WheelEvent) => {
      if (overlayOpen()) return;
      e.preventDefault();
      const dir = gate(e.timeStamp, e.deltaY);
      if (dir) step(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || overlayOpen() || isTypingTarget(e.target) || e.altKey || e.ctrlKey || e.metaKey) return;
      const onButton = e.target instanceof HTMLElement ? e.target.closest("button, a, [role=tab], [role=radio], input") : null;
      const map: Record<string, () => void> = {
        PageDown: () => step(1),
        PageUp: () => step(-1),
        ArrowDown: () => step(1),
        ArrowUp: () => step(-1),
        Home: () => goTo(0),
        End: () => goTo(panelsRef.current.length - 1),
      };
      if (e.key === " " && !onButton) map[" "] = () => step(e.shiftKey ? -1 : 1);
      // Arrow keys inside widgets (tabs, radio groups) belong to the widget.
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && onButton?.matches("[role=tab], [role=radio], input")) return;
      const action = map[e.key];
      if (!action) return;
      e.preventDefault();
      action();
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY === null || overlayOpen()) return;
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      touchY = null;
      if (Math.abs(dy) > 50) step(dy > 0 ? 1 : -1);
    };

    const onFocusIn = (e: FocusEvent) => {
      const i = panelIndexOf(e.target instanceof Element ? e.target : null);
      if (i >= 0 && i !== indexRef.current) goTo(i);
    };

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.getAttribute("href") === "#") return;
      const i = panelIndexOf(document.getElementById(decodeURIComponent(link.hash.slice(1))));
      if (i < 0) return;
      e.preventDefault();
      goTo(i);
    };

    // Hash changes without a reload (typed URL, back/forward between #anchors).
    const onHashChange = () => {
      const i = panelIndexOf(document.getElementById(decodeURIComponent(window.location.hash.slice(1))));
      if (i >= 0) goTo(i);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("click", onClick);
    };
  }, [enabled, goTo]);

  const offset = enabled ? (layout.offsets[index] ?? 0) : 0;
  const rail = enabled ? (layout.rails[index] ?? null) : null;

  const value = useMemo<Paging>(() => ({ enabled, index, rail, goTo, goToRail }), [enabled, index, rail, goTo, goToRail]);

  return (
    <PagingContext.Provider value={value}>
      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          data-animate={!reduced}
          style={enabled ? { transform: `translate3d(0, ${-offset}px, 0)` } : undefined}
        >
          {children}
        </div>
      </div>
      {overlay}
    </PagingContext.Provider>
  );
}
