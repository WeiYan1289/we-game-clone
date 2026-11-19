"use client";

import { type FormEvent, useState } from "react";
import { SEARCH_SUGGESTIONS } from "@/data/navigation";
import { useInterval } from "@/hooks/useInterval";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Icon } from "../ui/Icon";
import styles from "./SearchBox.module.css";

type Props = { className?: string };

/** Search field whose placeholder cycles through trending titles. No backend. */
export function SearchBox({ className }: Props) {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const reduced = usePrefersReducedMotion();

  // Stop rotating once the user starts typing, or under reduced motion.
  useInterval(() => setIndex((i) => (i + 1) % SEARCH_SUGGESTIONS.length), query || reduced ? null : 3500);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form role="search" className={`${styles.form} ${className ?? ""}`} onSubmit={onSubmit}>
      <label className="visually-hidden" htmlFor="site-search">
        搜索游戏
      </label>
      <input
        id="site-search"
        type="search"
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={SEARCH_SUGGESTIONS[index]}
        autoComplete="off"
      />
      <button type="submit" className={styles.submit} aria-label="搜索">
        <Icon name="search" size={18} />
      </button>
    </form>
  );
}
