import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  align?: "center" | "start";
  id?: string;
};

/** Shared section title block so every section's type scale stays consistent. */
export function SectionHeading({ title, subtitle, eyebrow, align = "center", id }: Props) {
  return (
    <header className={styles.heading} data-align={align}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
