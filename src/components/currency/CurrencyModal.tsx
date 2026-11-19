"use client";

import { type MouseEvent, useEffect, useRef } from "react";
import type { GeoState, GeoStatus } from "@/hooks/useGeoCurrency";
import { LOCALE_LABELS, LOCALES, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { countryName, SUPPORTED_COUNTRIES } from "@/lib/currency";
import { Icon } from "../ui/Icon";
import { CurrencyResult } from "./CurrencyResult";
import styles from "./CurrencyModal.module.css";

type Props = {
  state: GeoState;
  dict: Dictionary["region"];
  locale: Locale;
  /** True after a detection switched the page to the visitor's language. */
  languageSwitched?: boolean;
  onLocate: () => void;
  onChooseCountry: (code: string) => void;
  onChangeLocale: (locale: Locale) => void;
  onClose: () => void;
};

const FAILURES: GeoStatus[] = ["denied", "timeout", "unavailable", "unsupported", "error"];

/**
 * Region, language & currency. Presentational: geo logic lives in
 * useGeoCurrency and locale switching in AppShell, so every state renders
 * from props and is easy to test. Native <dialog> provides the focus trap,
 * Escape handling and top layer.
 */
export function CurrencyModal({ state, dict, locale, languageSwitched, onLocate, onChooseCountry, onChangeLocale, onClose }: Props) {
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
  const busy = status === "locating" ? dict.locating : status === "resolving" ? dict.resolving : null;
  const isFailure = FAILURES.includes(status);
  const errorText = status === "error" ? dict.errors.lookup : isFailure ? dict.errors[status as keyof typeof dict.errors] : "";
  const helpText = isFailure ? dict.help[status as keyof typeof dict.help] : "";
  // Country names follow the page language (Intl.DisplayNames).
  const countryOptions = SUPPORTED_COUNTRIES.map((c) => ({ code: c.code, name: countryName(c.code, locale) })).sort((a, b) =>
    a.name.localeCompare(b.name, locale),
  );

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="region-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={onBackdropClick}
    >
      <div className={styles.card}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{dict.eyebrow}</p>
            <h2 id="region-title" className={styles.title}>
              {dict.title}
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label={dict.close}>
            <Icon name="close" />
          </button>
        </header>

        {status === "idle" && (
          <div className={styles.intro}>
            <div className={styles.illustration} aria-hidden="true">
              <Icon name="location" size={36} />
            </div>
            <p>{dict.intro}</p>
            <button type="button" className={styles.primary} onClick={onLocate}>
              <Icon name="location" size={18} />
              {dict.detect}
            </button>
          </div>
        )}

        {busy && (
          <div className={styles.busy} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            {busy}
          </div>
        )}

        {status === "success" && <CurrencyResult state={state} dict={dict} locale={locale} />}

        {isFailure && (
          <div className={styles.failure}>
            <p role="alert" className={styles.alert}>
              <strong>{errorText}</strong> {helpText}
            </p>
            {status !== "unsupported" && (
              <button type="button" className={styles.secondary} onClick={onLocate}>
                {dict.retry}
              </button>
            )}
          </div>
        )}

        {!busy && (
          <div className={styles.picker}>
            <label htmlFor="country-picker">{status === "success" ? dict.changeCountry : dict.chooseCountry}</label>
            <select
              id="country-picker"
              className={styles.select}
              value={status === "success" ? state.countryCode : ""}
              onChange={(e) => e.target.value && onChooseCountry(e.target.value)}
            >
              <option value="" disabled>
                {dict.selectCountry}
              </option>
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.picker}>
          <label htmlFor="locale-picker">{dict.language}</label>
          <select id="locale-picker" className={styles.select} value={locale} onChange={(e) => onChangeLocale(e.target.value as Locale)}>
            {LOCALES.map((l) => (
              <option key={l} value={l} lang={l}>
                {LOCALE_LABELS[l]}
              </option>
            ))}
          </select>
          {languageSwitched && status === "success" && <p className={styles.switched}>✓ {dict.languageSwitched}</p>}
        </div>

        {status === "success" && (
          <div className={styles.footerActions}>
            <button type="button" className={styles.secondary} onClick={onLocate}>
              {dict.detectAgain}
            </button>
            <button type="button" className={styles.primary} onClick={onClose}>
              {dict.done}
            </button>
          </div>
        )}

        <p className={styles.privacy}>{dict.privacy}</p>
      </div>
    </dialog>
  );
}
