"use client";

import { useOffline } from "next/offline";
import { Icon } from "../ui/Icon";
import styles from "./OfflineBanner.module.css";

/** Connectivity notice. `useOffline` (experimental.useOffline) also catches "online but no internet". */
export function OfflineBanner({ text }: { text: string }) {
  const offline = useOffline();
  if (!offline) return null;

  return (
    <div role="status" className={styles.banner}>
      <Icon name="wifiOff" size={16} />
      <span>{text}</span>
    </div>
  );
}
