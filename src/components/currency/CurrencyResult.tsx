import type { GeoSource, GeoState } from "@/hooks/useGeoCurrency";
import { currencyName, flagEmoji, formatPrice } from "@/lib/currency";
import styles from "./CurrencyModal.module.css";

const SOURCE_LABEL: Record<GeoSource, string> = {
  api: "Detected from your location",
  offline: "Approximate — on-device lookup (geocoding service unreachable)",
  manual: "Chosen manually",
};

const SAMPLE_PRICES = [
  { label: "Indie title", amount: 49 },
  { label: "Season pass", amount: 199 },
  { label: "Deluxe edition", amount: 1299.5 },
];

export function CurrencyResult({ state }: { state: GeoState }) {
  const { countryCode = "", countryName, currency = "USD", fallbackCurrency, source = "api" } = state;
  // Format with the country's conventions (grouping, symbol placement) in English.
  const locale = `en-${countryCode}`;

  return (
    <div className={styles.result}>
      <div className={styles.country}>
        <span className={styles.flag} aria-hidden="true">
          {flagEmoji(countryCode)}
        </span>
        <div>
          <p className={styles.countryName}>{countryName}</p>
          <p className={styles.source}>{SOURCE_LABEL[source]}</p>
        </div>
      </div>

      <div className={styles.currencyCard}>
        <span className={styles.code}>{currency}</span>
        <span className={styles.currencyName}>{currencyName(currency)}</span>
      </div>

      {fallbackCurrency && (
        <p className={styles.note}>No local currency on file for this region, so prices are shown in US dollars.</p>
      )}

      <ul className={styles.samples} aria-label="Price formatting preview">
        {SAMPLE_PRICES.map((p) => (
          <li key={p.label}>
            <span>{p.label}</span>
            <strong>{formatPrice(p.amount, currency, locale)}</strong>
          </li>
        ))}
      </ul>
      <p className={styles.hint}>Preview of local price formatting — amounts are illustrative, not converted.</p>
    </div>
  );
}
