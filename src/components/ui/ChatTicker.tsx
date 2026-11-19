import styles from "./ChatTicker.module.css";

type Props = { messages: string[]; reverse?: boolean };

/**
 * Infinite CSS marquee. The list is rendered twice and the track slides by
 * exactly one copy (-50%), so the loop is seamless. The clone is aria-hidden.
 */
export function ChatTicker({ messages, reverse }: Props) {
  return (
    <div className={styles.ticker} data-reverse={reverse}>
      <div className={styles.track}>
        <ul className={styles.list}>
          {messages.map((m) => (
            <li key={m} className={styles.bubble}>
              {m}
            </li>
          ))}
        </ul>
        <ul className={styles.list} aria-hidden="true">
          {messages.map((m) => (
            <li key={m} className={styles.bubble}>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
