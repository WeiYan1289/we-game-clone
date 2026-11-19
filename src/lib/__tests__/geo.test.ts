import { afterEach, describe, expect, it, vi } from "vitest";
import { countryFromCoords, reverseGeocode } from "../geo";

describe("countryFromCoords (offline fallback)", () => {
  it.each([
    ["Kuala Lumpur", 3.139, 101.687, "MY"],
    ["Singapore", 1.352, 103.82, "SG"],
    ["Jakarta", -6.2, 106.8, "ID"],
    ["Bangkok", 13.75, 100.5, "TH"],
    ["Seoul", 37.57, 126.98, "KR"],
    ["Tokyo", 35.68, 139.69, "JP"],
    ["Shenzhen", 22.54, 114.06, "CN"],
    ["New York", 40.71, -74.0, "US"],
    ["London", 51.5, -0.12, "GB"],
  ])("%s → %s", (_city, lat, lon, code) => {
    expect(countryFromCoords(lat, lon)).toBe(code);
  });

  it("returns null in the middle of the ocean", () => {
    expect(countryFromCoords(0, 0)).toBeNull();
  });
});

describe("reverseGeocode", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the country code and name from the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ countryCode: "MY", countryName: "Malaysia" }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(reverseGeocode(3.1, 101.6)).resolves.toEqual({ countryCode: "MY", countryName: "Malaysia" });
    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("latitude")).toBe("3.1");
    expect(url.searchParams.get("longitude")).toBe("101.6");
  });

  it("rejects on a non-2xx response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
    await expect(reverseGeocode(1, 1)).rejects.toThrow(/500/);
  });

  it("rejects when the API has no country for the point", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ countryCode: "", countryName: "" }), { status: 200 })),
    );
    await expect(reverseGeocode(0, 0)).rejects.toThrow(/no country/i);
  });
});
