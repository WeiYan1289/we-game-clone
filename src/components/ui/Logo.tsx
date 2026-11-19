import Image from "next/image";
import styles from "./Logo.module.css";

/** WeGame mark + wordmark. Wordmark is real text so it scales and is selectable. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className={styles.logo}>
      <Image src="/images/icon-logo.svg" alt="" width={size} height={size} priority />
      <span className={styles.word}>WeGame</span>
    </span>
  );
}
