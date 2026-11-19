/** Pure helpers behind desktop full-page section paging. */

export function stepIndex(current: number, direction: -1 | 1, count: number): number {
  return Math.min(count - 1, Math.max(0, current + direction));
}

type WheelGateOptions = {
  /** Ignore input for this long after a page change (covers the slide transition). */
  lockMs: number;
  /** Events closer together than this may belong to the same gesture. */
  quietMs: number;
  /** Deltas smaller than this are treated as jitter. */
  minDelta: number;
};

/** Mouse-wheel notches report large, identical deltas (~100–120 px). */
const NOTCH_DELTA = 50;
/** A swipe must grow the delta by this factor to count as new intent (momentum wobbles ±1–2 px). */
const REACCELERATION = 1.3;

/**
 * Turns a noisy stream of wheel events into at most one page step per
 * deliberate gesture. Returns -1 / 0 / 1 for (timestamp, deltaY).
 *
 * After the transition lock, an event that follows closely on the previous
 * one is accepted only if it looks like *new* intent:
 *  - a mouse-wheel notch (large delta, not shrinking), or
 *  - a re-accelerating swipe (delta clearly larger than the last one).
 * A shrinking or flat, small delta is trackpad momentum from the previous
 * flick and is ignored — so one flick moves exactly one page, while steady
 * wheel scrolling keeps paging at one page per transition.
 */
export function createWheelGate({ lockMs, quietMs, minDelta }: WheelGateOptions) {
  let lockedUntil = 0;
  let lastEventAt = -Infinity;
  let lastAbs = 0;

  return function accept(now: number, deltaY: number): -1 | 0 | 1 {
    const abs = Math.abs(deltaY);
    const sinceLast = now - lastEventAt;
    const prevAbs = lastAbs;
    lastEventAt = now;
    lastAbs = abs;

    if (abs < minDelta || now < lockedUntil) return 0;

    const sameGesture = sinceLast < quietMs;
    const isNotch = abs >= NOTCH_DELTA && abs >= prevAbs;
    const accelerating = abs > prevAbs * REACCELERATION;
    if (sameGesture && !isNotch && !accelerating) return 0;

    lockedUntil = now + lockMs;
    return deltaY > 0 ? 1 : -1;
  };
}
