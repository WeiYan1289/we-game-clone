import type { GeoState } from "@/hooks/useGeoCurrency";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { countryName, currencyName, flagEmoji, formatPrice } from "@/lib/currency";
import styles from "./CurrencyModal.module.css";

const SAMPLE_AMOUNTS = [49, 199, 1299.5];

type Props = { state: GeoState; dict: Dictionary["region"]; locale: Locale };

export function CurrencyResult({ state, dict, locale }: Props) {
  const { countryCode = "", currency = "USD", fallbackCurrency, source = "api" } = state;
  // Number formatting follows the country's conventions (grouping, symbol placement)…
  const formatLocale = `${locale === "zh-CN" ? "zh" : locale}-${countryCode}`;

  return (
    <div className={styles.result}>
      <div className={styles.country}>
        <span className={styles.flag} aria-hidden="true">
          {flagEmoji(countryCode)}
        </span>
        <div>
          {/* …while names follow the page language. */}
          <p className={styles.countryName}>{countryName(countryCode, locale)}</p>
          <p className={styles.source}>{dict.source[source]}</p>
        </div>
      </div>

      <div className={styles.currencyCard}>
        <span className={styles.code}>{currency}</span>
        <span className={styles.currencyName}>{currencyName(currency, locale)}</span>
      </div>

      {fallbackCurrency && <p className={styles.note}>{dict.fallbackNote}</p>}

      <ul className={styles.samples} aria-label={dict.samplesLabel}>
        {SAMPLE_AMOUNTS.map((amount, i) => (
          <li key={amount}>
            <span>{dict.samples[i]}</span>
            <strong>{formatPrice(amount, currency, formatLocale)}</strong>
          </li>
        ))}
      </ul>
      <p className={styles.hint}>{dict.samplesHint}</p>
    </div>
  );
}
