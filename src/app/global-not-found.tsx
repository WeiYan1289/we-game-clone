import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "404 · WeGame" };

/**
 * With root layouts under `app/[lang]` and `app/offline`, unmatched URLs need a
 * global 404 (experimental.globalNotFound) that renders its own <html>.
 */
export default function GlobalNotFound() {
  return (
    <html lang="zh-CN">
      <body
        style={{
          display: "grid",
          placeContent: "center",
          gap: 16,
          minHeight: "100dvh",
          textAlign: "center",
          background: "radial-gradient(ellipse at 50% 120%, rgba(255,106,0,.35), transparent 60%), #0b0b0d",
        }}
      >
        <p style={{ fontSize: 64, fontWeight: 900, fontStyle: "italic", color: "#ff9a3c" }}>404</p>
        <p>页面不存在 · Page not found</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global 404 renders outside the app router */}
        <a href="/" style={{ color: "#ff9a3c", textDecoration: "underline" }}>
          返回首页 · Back to home
        </a>
      </body>
    </html>
  );
}
