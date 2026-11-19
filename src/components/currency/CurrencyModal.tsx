"use client";

import { type MouseEvent, useEffect, useRef } from "react";
import type { GeoState } from "@/hooks/useGeoCurrency";
import { SUPPORTED_COUNTRIES } from "@/lib/currency";
import { Icon } from "../ui/Icon";
import { CurrencyResult } from "./CurrencyResult";
import styles from "./CurrencyModal.module.css";

type Props = {
  state: GeoState;
  onLocate: () => void;
  onChooseCountry: (code: string) => void;
  onClose: () => void;
};

const BUSY: Partial<Record<GeoState["status"], string>> = {
  locating: "Waiting for location permission…",
  resolving: "Looking up your country…",
};

const HELP: Partial<Record<GeoState["status"], string>> = {
  denied: "Allow location for this site in your browser's address bar, then try again — or pick your country below.",
  timeout: "Your device took too long to find its position.",
  unavailable: "Location services may be turned off on this device.",
  unsupported: "You can still choose your country manually.",
  error: "You can try again or choose your country manually.",
};

/**
 * Presentational modal: all logic lives in useGeoCurrency, so every state is
 * rendered from props and is trivially testable. Uses the native <dialog>
 * for focus trapping, Escape handling and the top layer.
 */
export function CurrencyModal({ state, onLocate, onChooseCountry, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === "function") {
      try {
        dialog.showModal();
        return;
      } catch {
        /* fall through (e.g. jsdom) */
      }
    }
    dialog.setAttribute("open", "");
  }, []);

  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const { status } = state;
  const busy = BUSY[status];
  const isFailure = status in HELP;
  const canRetry = isFailure && status !== "unsupported";

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="currency-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={onBackdropClick}
    >
      <div className={styles.card}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>地区与货币</p>
            <h2 id="currency-title" className={styles.title}>
              Region &amp; currency
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        {status === "idle" && (
          <div className={styles.intro}>
            <div className={styles.illustration} aria-hidden="true">
              <Icon name="location" size={36} />
            </div>
            <p>We&apos;ll use your device&apos;s location to show prices in your local currency.</p>
            <button type="button" className={styles.primary} onClick={onLocate}>
              <Icon name="location" size={18} />
              Detect my location
            </button>
          </div>
        )}

        {busy && (
          <div className={styles.busy} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            {busy}
          </div>
        )}

        {status === "success" && <CurrencyResult state={state} />}

        {isFailure && (
          <div className={styles.failure}>
            <p role="alert" className={styles.alert}>
              <strong>{state.message}</strong> {HELP[status]}
            </p>
            {canRetry && (
              <button type="button" className={styles.secondary} onClick={onLocate}>
                Try again
              </button>
            )}
          </div>
        )}

        {(isFailure || status === "success" || status === "idle") && (
          <div className={styles.picker}>
            <label htmlFor="country-picker">{status === "success" ? "Not right? Choose your country" : "Or choose your country"}</label>
            <select
              id="country-picker"
              className={styles.select}
              value={status === "success" ? state.countryCode : ""}
              onChange={(e) => e.target.value && onChooseCountry(e.target.value)}
            >
              <option value="" disabled>
                Select a country…
              </option>
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {status === "success" && (
          <div className={styles.footerActions}>
            <button type="button" className={styles.secondary} onClick={onLocate}>
              Detect again
            </button>
            <button type="button" className={styles.primary} onClick={onClose}>
              Done
            </button>
          </div>
        )}

        <p className={styles.privacy}>
          Privacy: your coordinates are sent only to BigDataCloud&apos;s free reverse-geocoding API to find your country.
          If it&apos;s unreachable, an approximate on-device lookup is used instead. Nothing is stored.
        </p>
      </div>
    </dialog>
  );
}
