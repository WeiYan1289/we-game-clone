import type { Metadata } from "next";
import { RetryButton } from "./RetryButton";
import styles from "./offline.module.css";

export const metadata: Metadata = {
  title: "离线 · WeGame",
  robots: { index: false },
};

/**
 * Fallback served by the service worker when a navigation fails and the page
 * isn't cached. Self-contained: only precached assets, no next/image.
 */
export default function OfflinePage() {
  return (
    <main className={styles.page}>
      {/* Plain <img>: /_next/image would need the network; this SVG is precached. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/icon-logo.svg" alt="WeGame" width={155} height={39} />
      <div className={styles.signal} aria-hidden="true" />
      <h1 className={styles.title}>网络已断开</h1>
      <p className={styles.text}>
        You&apos;re offline. 这个页面还没有被缓存，请检查网络后重试。已访问过的首页内容仍可离线浏览。
      </p>
      <div className={styles.actions}>
        <RetryButton className={styles.primary} />
        {/* Deliberately a full document navigation (not <Link>): the service worker
            answers it from cache, whereas a client-side RSC fetch would fail offline. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className={styles.secondary}>
          返回首页
        </a>
      </div>
    </main>
  );
}
