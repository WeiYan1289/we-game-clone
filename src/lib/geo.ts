/**
 * Coordinates → country. Primary: BigDataCloud's free client-side reverse
 * geocoder (no API key, CORS-enabled). Fallback: coarse bounding boxes so the
 * feature still works when the API is down or the device is offline.
 */

export type GeoCountry = { countryCode: string; countryName: string };

const REVERSE_GEOCODE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export async function reverseGeocode(lat: number, lon: number, signal?: AbortSignal): Promise<GeoCountry> {
  const url = new URL(REVERSE_GEOCODE_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("localityLanguage", "en");

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Reverse geocoding failed (HTTP ${res.status})`);

  const data = (await res.json()) as Partial<GeoCountry>;
  if (!data.countryCode) throw new Error("Reverse geocoding returned no country for this location");
  return { countryCode: data.countryCode, countryName: data.countryName || data.countryCode };
}

type Box = [code: string, minLat: number, maxLat: number, minLon: number, maxLon: number];

/**
 * Approximate country extents. Order matters: boxes overlap, so smaller or
 * enclosed countries come before the larger neighbours that contain them
 * (e.g. SG before MY, KR before JP before CN). Good enough for a fallback;
 * border areas can be misattributed.
 */
const BOXES: Box[] = [
  ["SG", 1.13, 1.48, 103.6, 104.1],
  ["MY", 0.85, 7.4, 99.6, 119.3],
  ["TH", 5.6, 20.5, 97.3, 105.7],
  ["VN", 8.4, 23.4, 102.1, 109.5],
  ["PH", 4.5, 21.2, 116.9, 126.7],
  ["ID", -11.0, 6.1, 95.0, 141.0],
  ["KR", 33.0, 38.7, 124.5, 131.0],
  ["JP", 24.0, 45.6, 122.9, 146.0],
  ["IN", 6.5, 35.7, 68.0, 97.4],
  ["CN", 18.0, 53.6, 73.5, 135.0],
  ["AU", -44.0, -10.0, 112.0, 154.0],
  ["GB", 49.9, 60.9, -8.7, 1.8],
  ["US", 24.4, 49.4, -125.0, -66.9],
];

export function countryFromCoords(lat: number, lon: number): string | null {
  const hit = BOXES.find(([, minLat, maxLat, minLon, maxLon]) => lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon);
  return hit ? hit[0] : null;
}
