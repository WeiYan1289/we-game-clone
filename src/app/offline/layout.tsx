import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "离线 · Offline · WeGame",
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: "#0b0b0d", width: "device-width", initialScale: 1 };

/**
 * Separate root layout: the offline fallback must not depend on the locale
 * routes, so it is bilingual and self-contained.
 */
export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
