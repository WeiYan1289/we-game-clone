import type { ComponentPropsWithoutRef } from "react";
import styles from "./Panel.module.css";

type Props = ComponentPropsWithoutRef<"section"> & {
  /** Index into the side-rail groups (0 = 大作 … 4 = 高校); omit for panels without a rail entry. */
  rail?: number;
  /** Mobile height in design units (default 780 → a 1440:780 panel, like the original). */
  mobileUnits?: number;
};

/**
 * One full-screen step of the page. On desktop every Panel is exactly one
 * viewport tall and FullPage pages between them; on mobile it keeps the
 * reference composition at a fixed aspect ratio and the page scrolls normally.
 */
export function Panel({ rail, mobileUnits, className, style, children, ...rest }: Props) {
  return (
    <section
      data-panel=""
      data-rail={rail}
      className={`${styles.panel} ${className ?? ""}`}
      style={mobileUnits ? ({ "--mobile-units": mobileUnits, ...style } as React.CSSProperties) : style}
      {...rest}
    >
      {children}
    </section>
  );
}

/**
 * The 1440×900 reference stage, centred in its Panel. Absolutely-positioned
 * artwork inside uses design-unit coordinates measured from the original.
 */
export function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`${styles.frame} ${className ?? ""}`}>{children}</div>;
}
