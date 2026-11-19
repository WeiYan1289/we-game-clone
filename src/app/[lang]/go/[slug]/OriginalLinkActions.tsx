"use client";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import { originalSearchUrl } from "@/data/links";
import styles from "./go.module.css";

type Props = {
  url: string;
  /** Search carries the visitor's query (?q=) through to the original search page. */
  isSearch: boolean;
  labels: { open: string; newTab: string; copy: string; copied: string };
};

const noopSubscribe = () => () => {};
const readQuery = () => new URLSearchParams(window.location.search).get("q") ?? "";

/** The page is static, so the search query is read on the client (hydration-safe). */
export function OriginalLinkActions({ url, isSearch, labels }: Props) {
  const query = useSyncExternalStore(noopSubscribe, readQuery, () => "");
  const target = isSearch ? originalSearchUrl(query) : url;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the URL is visible to copy by hand */
    }
  };

  return (
    <div className={styles.actions}>
      <div className={styles.urlRow}>
        <code className={styles.url}>{target}</code>
        <button type="button" className={styles.copy} onClick={copy} aria-live="polite">
          {copied ? labels.copied : labels.copy}
        </button>
      </div>
      <a href={target} target="_blank" rel="noopener noreferrer" className={styles.open}>
        {labels.open}
        <Icon name="external" size={16} />
        <span className="visually-hidden">({labels.newTab})</span>
      </a>
    </div>
  );
}
