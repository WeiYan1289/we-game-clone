import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGeoCurrency } from "../useGeoCurrency";

type Success = (pos: { coords: { latitude: number; longitude: number } }) => void;
type Failure = (err: { code: number; message: string }) => void;

/** Installs a fake navigator.geolocation whose getCurrentPosition runs `impl`. */
function mockGeolocation(impl: (ok: Success, fail: Failure) => void) {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: vi.fn(impl) },
  });
}

const at = (latitude: number, longitude: number) => (ok: Success) => ok({ coords: { latitude, longitude } });
const failWith = (code: number) => (_ok: Success, fail: Failure) => fail({ code, message: "x" });
const apiReturns = (body: object) =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status: 200 })));
const apiFails = () => vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(navigator, "geolocation");
});

describe("useGeoCurrency", () => {
  it("starts idle", () => {
    const { result } = renderHook(() => useGeoCurrency());
    expect(result.current.state.status).toBe("idle");
  });

  it("reports unsupported when the Geolocation API is missing", () => {
    Reflect.deleteProperty(navigator, "geolocation");
    const { result } = renderHook(() => useGeoCurrency());
    act(() => result.current.locate());
    expect(result.current.state.status).toBe("unsupported");
  });

  it("resolves country and currency through the reverse-geocoding API", async () => {
    mockGeolocation(at(3.139, 101.687));
    apiReturns({ countryCode: "MY", countryName: "Malaysia" });
    const { result } = renderHook(() => useGeoCurrency());

    act(() => result.current.locate());

    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(result.current.state).toMatchObject({ countryCode: "MY", currency: "MYR", source: "api", fallbackCurrency: false });
  });

  it("falls back to the offline lookup when the API is unreachable", async () => {
    mockGeolocation(at(-6.2, 106.8));
    apiFails();
    const { result } = renderHook(() => useGeoCurrency());

    act(() => result.current.locate());

    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(result.current.state).toMatchObject({ countryCode: "ID", currency: "IDR", source: "offline" });
  });

  it("errors when neither the API nor the offline lookup can place the coordinates", async () => {
    mockGeolocation(at(0, 0));
    apiFails();
    const { result } = renderHook(() => useGeoCurrency());

    act(() => result.current.locate());

    await waitFor(() => expect(result.current.state.status).toBe("error"));
    expect(result.current.state.message).toMatch(/couldn.t determine/i);
  });

  it("flags currency fallback for an unmapped country", async () => {
    mockGeolocation(at(-75, 0));
    apiReturns({ countryCode: "AQ", countryName: "Antarctica" });
    const { result } = renderHook(() => useGeoCurrency());

    act(() => result.current.locate());

    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(result.current.state).toMatchObject({ currency: "USD", fallbackCurrency: true });
  });

  it.each([
    [1, "denied"],
    [2, "unavailable"],
    [3, "timeout"],
  ])("maps GeolocationPositionError code %i to %s", (code, status) => {
    mockGeolocation(failWith(code));
    const { result } = renderHook(() => useGeoCurrency());
    act(() => result.current.locate());
    expect(result.current.state.status).toBe(status);
  });

  it("lets the user pick a country manually", () => {
    const { result } = renderHook(() => useGeoCurrency());
    act(() => result.current.chooseCountry("ID"));
    expect(result.current.state).toMatchObject({ status: "success", countryCode: "ID", currency: "IDR", source: "manual" });
  });

  it("shows locating while waiting for the permission prompt", () => {
    mockGeolocation(() => {}); // never answers
    const { result } = renderHook(() => useGeoCurrency());
    act(() => result.current.locate());
    expect(result.current.state.status).toBe("locating");
  });
});

describe("useGeoCurrency — persistence across the locale switch (full page load)", () => {
  afterEach(() => sessionStorage.clear());

  it("saves a successful result to sessionStorage", () => {
    const { result } = renderHook(() => useGeoCurrency());
    act(() => result.current.chooseCountry("MY"));
    expect(JSON.parse(sessionStorage.getItem("wegame:region")!)).toMatchObject({ countryCode: "MY", currency: "MYR", source: "manual" });
  });

  it("restores a saved result on mount", async () => {
    sessionStorage.setItem(
      "wegame:region",
      JSON.stringify({ countryCode: "ID", countryName: "Indonesia", currency: "IDR", fallbackCurrency: false, source: "api" }),
    );
    const { result } = renderHook(() => useGeoCurrency());
    await waitFor(() => expect(result.current.state.status).toBe("success"));
    expect(result.current.state).toMatchObject({ countryCode: "ID", currency: "IDR", source: "api" });
  });

  it("ignores corrupt saved data", () => {
    sessionStorage.setItem("wegame:region", "{not json");
    const { result } = renderHook(() => useGeoCurrency());
    expect(result.current.state.status).toBe("idle");
  });
});
