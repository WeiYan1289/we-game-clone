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
  const gate = () => createWheelGate({ lockMs: 900, quietMs: 150, minDelta: 8 });

  it("ignores tiny deltas (trackpad jitter)", () => {
    expect(gate()(1000, 3)).toBe(0);
  });

  it("returns the direction of a deliberate scroll", () => {
    expect(gate()(1000, 40)).toBe(1);
    expect(gate()(1000, -40)).toBe(-1);
  });

  it("locks while the page transition runs", () => {
    const accept = gate();
    expect(accept(1000, 40)).toBe(1);
    expect(accept(1500, 40)).toBe(0);
  });

  it("swallows trackpad inertia that keeps firing after the lock expires", () => {
    const accept = gate();
    expect(accept(1000, 40)).toBe(1);
    // Continuous momentum events every 16ms well past the 900ms lock…
    let t = 1000;
    for (; t < 2400; t += 16) expect(accept(t, 30)).toBe(0);
    // …until the wheel goes quiet; then a fresh gesture is accepted.
    expect(accept(t + 200, 40)).toBe(1);
  });
});
