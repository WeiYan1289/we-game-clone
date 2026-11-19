/** Pure helpers behind desktop full-page section paging. */

export function stepIndex(current: number, direction: -1 | 1, count: number): number {
  return Math.min(count - 1, Math.max(0, current + direction));
}

type WheelGateOptions = {
  /** Ignore input for this long after a page change (covers the slide transition). */
  lockMs: number;
  /** After the lock, require this much silence before accepting again (kills trackpad inertia). */
  quietMs: number;
  /** Deltas smaller than this are treated as jitter. */
  minDelta: number;
};

/**
 * Turns a noisy stream of wheel events into at most one page step per
 * deliberate gesture. Returns -1 / 0 / 1 for (timestamp, deltaY).
 */
export function createWheelGate({ lockMs, quietMs, minDelta }: WheelGateOptions) {
  let lockedUntil = 0;
  let lastEventAt = -Infinity;

  return function accept(now: number, deltaY: number): -1 | 0 | 1 {
    const sinceLast = now - lastEventAt;
    lastEventAt = now;

    if (Math.abs(deltaY) < minDelta) return 0;
    if (now < lockedUntil) return 0;
    // Still part of the previous gesture's momentum tail.
    if (sinceLast < quietMs && lockedUntil > 0) return 0;

    lockedUntil = now + lockMs;
    return deltaY > 0 ? 1 : -1;
  };
}
