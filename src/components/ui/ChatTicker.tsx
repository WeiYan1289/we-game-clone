import styles from "./ChatTicker.module.css";

type Props = { messages: string[] };

/**
 * Vertical message feed, like the original's college chat: chips scroll
 * upward forever, fading in at the bottom and out at the top. The list is
 * rendered twice and the track moves by exactly one copy (-50%), so the loop
 * is seamless. The clone is aria-hidden.
 */
export function ChatTicker({ messages }: Props) {
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        <ul className={styles.list}>
          {messages.map((m) => (
            <li key={m} className={styles.message}>
              <span>{m}</span>
            </li>
          ))}
        </ul>
        <ul className={styles.list} aria-hidden="true">
          {messages.map((m) => (
            <li key={m} className={styles.message}>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
