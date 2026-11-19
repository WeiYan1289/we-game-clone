"use client";

import { type FormEvent, useId, useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Icon } from "../ui/Icon";
import styles from "./SearchBox.module.css";

type Props = {
  label: string;
  submitLabel: string;
  suggestions: string[];
  className?: string;
  /** Called with the trimmed query (or the shown suggestion when empty). */
  onSearch?: (query: string) => void;
};

/** Search field whose placeholder cycles through trending titles. No backend. */
export function SearchBox({ label, submitLabel, suggestions, className, onSearch }: Props) {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const reduced = usePrefersReducedMotion();
  // Several SearchBoxes can be on the page at once — ids must be unique.
  const inputId = useId();

  // Stop rotating once the user starts typing, or under reduced motion.
  useInterval(() => setIndex((i) => (i + 1) % suggestions.length), query || reduced ? null : 3500);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Empty box: search for the suggestion the placeholder is showing, like the original.
    onSearch?.(query.trim() || suggestions[index]);
  };

  return (
    <form role="search" className={`${styles.form} ${className ?? ""}`} onSubmit={onSubmit}>
      <label className="visually-hidden" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={suggestions[index]}
        autoComplete="off"
      />
      <button type="submit" className={styles.submit} aria-label={submitLabel}>
        <Icon name="search" size={20} />
      </button>
    </form>
  );
}
