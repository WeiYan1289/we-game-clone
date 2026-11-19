import { describe, expect, it } from "vitest";
import { createWheelGate, stepIndex } from "../paging";

describe("stepIndex", () => {
  it("moves forward and back within bounds", () => {
    expect(stepIndex(0, 1, 5)).toBe(1);
    expect(stepIndex(3, -1, 5)).toBe(2);
  });

  it("clamps at both ends (no wrap-around)", () => {
    expect(stepIndex(4, 1, 5)).toBe(4);
    expect(stepIndex(0, -1, 5)).toBe(0);
  });
});

describe("createWheelGate", () => {
  const LOCK = 700;
  const gate = () => createWheelGate({ lockMs: LOCK, quietMs: 150, minDelta: 6 });

  /** Feeds (time, delta) pairs and returns the times at which a page step was accepted. */
  const run = (events: [number, number][]) => {
    const accept = gate();
    return events.filter(([t, d]) => accept(t, d) !== 0).map(([t]) => t);
  };

  it("ignores tiny deltas (trackpad jitter)", () => {
    expect(gate()(1000, 3)).toBe(0);
  });

  it("returns the direction of a deliberate scroll", () => {
    expect(gate()(1000, 40)).toBe(1);
    expect(gate()(1000, -40)).toBe(-1);
  });

  it("locks while the page transition runs", () => {
    const accept = gate();
    expect(accept(1000, 100)).toBe(1);
    expect(accept(1500, 100)).toBe(0);
  });

  it("keeps paging while a mouse wheel scrolls steadily (regression: stalled after page 1)", () => {
    // One 100px notch every 100ms for 3 seconds, no pauses.
    const notches = Array.from({ length: 30 }, (_, i) => [1000 + i * 100, 100] as [number, number]);
    const accepted = run(notches);
    expect(accepted.length).toBeGreaterThanOrEqual(3);
    // Never faster than one page per transition.
    accepted.slice(1).forEach((t, i) => expect(t - accepted[i]).toBeGreaterThanOrEqual(LOCK));
  });

  it("swallows a trackpad fling's momentum tail — one flick, one page", () => {
    // Rising then exponentially decaying deltas every 16ms for ~2.5s.
    const fling: [number, number][] = [];
    let d = 20;
    for (let t = 0; t < 2500; t += 16) {
      fling.push([1000 + t, Math.round(d)]);
      d = t < 80 ? d * 1.6 : d * 0.95;
    }
    expect(run(fling)).toHaveLength(1);
  });

  it("swallows a long, flat momentum tail that outlasts the lock", () => {
    const accept = gate();
    expect(accept(1000, 40)).toBe(1);
    let t = 1000;
    for (; t < 2400; t += 16) expect(accept(t, 30)).toBe(0);
    // A fresh gesture after the wheel goes quiet is accepted.
    expect(accept(t + 200, 40)).toBe(1);
  });

  it("accepts a new swipe that starts while the previous tail is still fading", () => {
    const events: [number, number][] = [[1000, 60]];
    // Fading tail past the lock…
    for (let t = 1016, d = 40; t < 1900; t += 16, d = Math.max(8, d - 1)) events.push([t, d]);
    // …then the user swipes again: deltas rise.
    events.push([1916, 12], [1932, 24], [1948, 48]);
    // Accepted on the first clearly rising delta (8 → 12).
    expect(run(events)).toEqual([1000, 1916]);
  });

  it("ignores small wobbles in a momentum tail (not a new swipe)", () => {
    const events: [number, number][] = [[1000, 60]];
    // Tail hovers around 18–20 with ±1 noise well past the lock.
    for (let i = 0, t = 1016; t < 2200; t += 16, i++) events.push([t, 19 + (i % 3 === 0 ? 1 : i % 3 === 1 ? 0 : -1)]);
    expect(run(events)).toEqual([1000]);
  });
});
