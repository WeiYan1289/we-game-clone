import Image from "next/image";
import { GAMES } from "@/data/games";
import { PosterCarousel } from "../ui/PosterCarousel";
import { SectionHeading } from "../ui/SectionHeading";
import { RotatingPill } from "./RotatingPill";
import styles from "./TopicSection.module.css";

/** Posters that drift around the heading on wide screens (decorative). */
const FLOATERS = ["heping", "sanguosha", "mingchao", "heishenhua", "poe", "bt"];

export function TopicSection() {
  const floaters = GAMES.filter((g) => FLOATERS.includes(g.id));

  return (
    <section id="topic" className={styles.topic} aria-labelledby="topic-title">
      <div className={styles.floaters} aria-hidden="true">
        {floaters.map((g, i) => (
          <Image
            key={g.id}
            src={g.poster}
            alt=""
            width={190}
            height={250}
            sizes="12vw"
            className={styles.floater}
            style={{ animationDelay: `${i * -1.3}s` }}
          />
        ))}
      </div>

      <div className={styles.head}>
        <SectionHeading id="topic-title" title="大作云集" subtitle="总有新东西" />
        <RotatingPill />
      </div>

      <PosterCarousel items={GAMES} autoplayMs={3500} />
    </section>
  );
}
