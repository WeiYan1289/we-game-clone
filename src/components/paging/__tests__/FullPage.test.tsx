import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FullPage, usePaging } from "../FullPage";
import { Panel } from "../Panel";

function Probe() {
  const { enabled, index, rail } = usePaging();
  return <output data-testid="probe">{`${enabled}:${index}:${rail}`}</output>;
}

function setup() {
  render(
    <FullPage>
      <Probe />
      <Panel id="kv">hero</Panel>
      <Panel id="topic" rail={0}>
        <a href="#college">jump</a>
      </Panel>
      <Panel id="college" rail={1}>
        <button type="button">inside college</button>
      </Panel>
    </FullPage>,
  );
  return () => screen.getByTestId("probe").textContent;
}

describe("FullPage (desktop paging)", () => {
  beforeEach(() => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("turns paging on and starts at the first panel", () => {
    const probe = setup();
    expect(probe()).toBe("true:0:null");
    expect(document.documentElement.dataset.paging).toBe("on");
  });

  it("ArrowDown / PageDown advance one panel, clamped at the end", () => {
    const probe = setup();
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(probe()).toBe("true:1:0");
    fireEvent.keyDown(window, { key: "PageDown" });
    fireEvent.keyDown(window, { key: "PageDown" });
    expect(probe()).toBe("true:2:1");
  });

  it("Home / End jump to the first and last panels", () => {
    const probe = setup();
    fireEvent.keyDown(window, { key: "End" });
    expect(probe()).toBe("true:2:1");
    fireEvent.keyDown(window, { key: "Home" });
    expect(probe()).toBe("true:0:null");
  });

  it("routes in-page anchor links to the panel that contains the target", () => {
    const probe = setup();
    fireEvent.click(screen.getByText("jump"));
    expect(probe()).toBe("true:2:1");
  });

  it("follows keyboard focus into an off-screen panel", () => {
    const probe = setup();
    act(() => screen.getByRole("button", { name: "inside college" }).focus());
    expect(probe()).toBe("true:2:1");
  });

  it("ignores paging keys while a dialog is open", () => {
    const probe = setup();
    const dialog = document.createElement("dialog");
    dialog.setAttribute("open", "");
    document.body.append(dialog);
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(probe()).toBe("true:0:null");
    dialog.remove();
  });
});

describe("FullPage deep links", () => {
  beforeEach(() => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
    );
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    window.history.replaceState(null, "", "#college");
  });
  afterEach(() => {
    window.history.replaceState(null, "", "#");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("opens on the panel named in the URL hash", () => {
    const probe = setup();
    expect(probe()).toBe("true:2:1");
  });
});

describe("FullPage enter animations (data-current)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const panels = () => [...document.querySelectorAll<HTMLElement>("[data-panel]")];

  it("desktop: only the current panel is marked, so its entrance replays on every visit", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
    );
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    setup();
    expect(panels().map((p) => p.hasAttribute("data-current"))).toEqual([true, false, false]);
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(panels().map((p) => p.hasAttribute("data-current"))).toEqual([false, true, false]);
  });

  it("mobile: panels are marked as they scroll into view (and stay marked)", () => {
    let reveal: IntersectionObserverCallback = () => {};
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          reveal = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    setup();
    expect(panels().some((p) => p.hasAttribute("data-current"))).toBe(false);

    act(() => reveal([{ target: panels()[1], isIntersecting: true } as unknown as IntersectionObserverEntry], {} as IntersectionObserver));

    expect(panels().map((p) => p.hasAttribute("data-current"))).toEqual([false, true, false]);
  });
});

describe("FullPage image preloading", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("loads the current and neighbouring panels' lazy images eagerly", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({ matches: true, media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
    );
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    render(
      <FullPage>
        {[0, 1, 2, 3].map((i) => (
          <Panel key={i} id={`p${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- plain fixture for the loading attribute */}
            <img src={`/${i}.png`} alt="" loading="lazy" />
          </Panel>
        ))}
      </FullPage>,
    );
    const loading = () => [...document.querySelectorAll("img")].map((img) => img.getAttribute("loading"));
    expect(loading()).toEqual(["eager", "eager", "lazy", "lazy"]);
    fireEvent.keyDown(window, { key: "ArrowDown" });
    expect(loading()).toEqual(["eager", "eager", "eager", "lazy"]);
  });
});
