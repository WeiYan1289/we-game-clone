"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { countryName, getCurrencyForCountry } from "@/lib/currency";
import { countryFromCoords, reverseGeocode } from "@/lib/geo";

export type GeoStatus =
  | "idle"
  | "locating" // waiting on the permission prompt / GPS fix
  | "resolving" // have coordinates, looking up the country
  | "success"
  | "denied"
  | "timeout"
  | "unavailable"
  | "unsupported"
  | "error";

export type GeoSource = "api" | "offline" | "manual";

export type GeoState = {
  status: GeoStatus;
  coords?: { lat: number; lon: number };
  countryCode?: string;
  countryName?: string;
  currency?: string;
  /** True when the country has no mapping and USD was used instead. */
  fallbackCurrency?: boolean;
  source?: GeoSource;
  message?: string;
};

type Action =
  | { type: "start" }
  | { type: "coords"; lat: number; lon: number }
  | { type: "resolved"; countryCode: string; countryName: string; source: GeoSource }
  | { type: "fail"; status: Exclude<GeoStatus, "idle" | "locating" | "resolving" | "success">; message: string };

const initialState: GeoState = { status: "idle" };

export function geoReducer(state: GeoState, action: Action): GeoState {
  switch (action.type) {
    case "start":
      return { status: "locating" };
    case "coords":
      return { status: "resolving", coords: { lat: action.lat, lon: action.lon } };
    case "resolved": {
      const { currency, fallback } = getCurrencyForCountry(action.countryCode);
      return {
        status: "success",
        coords: state.coords,
        countryCode: action.countryCode.toUpperCase(),
        countryName: action.countryName,
        currency,
        fallbackCurrency: fallback,
        source: action.source,
      };
    }
    case "fail":
      return { status: action.status, coords: state.coords, message: action.message };
  }
}

const POSITION_ERRORS: Record<number, { status: "denied" | "unavailable" | "timeout"; message: string }> = {
  1: { status: "denied", message: "Location permission was denied." },
  2: { status: "unavailable", message: "Your device couldn't determine its position." },
  3: { status: "timeout", message: "Locating took too long." },
};

const GEO_OPTIONS: PositionOptions = { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 };
const LOOKUP_TIMEOUT_MS = 8_000;

/**
 * Browser location → country → local currency, as an explicit state machine.
 * Network lookup degrades to an on-device bounding-box lookup; every failure
 * mode lands in a distinct status the UI can explain.
 */
export function useGeoCurrency() {
  const [state, dispatch] = useReducer(geoReducer, initialState);
  const lookup = useRef<AbortController | null>(null);

  useEffect(() => () => lookup.current?.abort(), []);

  const resolveCountry = useCallback(async (lat: number, lon: number) => {
    lookup.current?.abort();
    const controller = new AbortController();
    lookup.current = controller;
    const timer = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);

    try {
      const { countryCode, countryName: name } = await reverseGeocode(lat, lon, controller.signal);
      if (lookup.current === controller) dispatch({ type: "resolved", countryCode, countryName: name, source: "api" });
    } catch {
      if (lookup.current !== controller) return; // superseded by a newer request
      const code = countryFromCoords(lat, lon);
      if (code) dispatch({ type: "resolved", countryCode: code, countryName: countryName(code), source: "offline" });
      else
        dispatch({
          type: "fail",
          status: "error",
          message: "We couldn't determine your country — the lookup service is unreachable.",
        });
    } finally {
      clearTimeout(timer);
    }
  }, []);

  const locate = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      dispatch({ type: "fail", status: "unsupported", message: "This browser doesn't support location detection." });
      return;
    }
    dispatch({ type: "start" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        dispatch({ type: "coords", lat: coords.latitude, lon: coords.longitude });
        void resolveCountry(coords.latitude, coords.longitude);
      },
      (err) => {
        const mapped = POSITION_ERRORS[err.code] ?? { status: "error" as const, message: err.message };
        dispatch({ type: "fail", ...mapped });
      },
      GEO_OPTIONS,
    );
  }, [resolveCountry]);

  const chooseCountry = useCallback((code: string) => {
    lookup.current?.abort();
    lookup.current = null;
    dispatch({ type: "resolved", countryCode: code, countryName: countryName(code), source: "manual" });
  }, []);

  return { state, locate, chooseCountry };
}
