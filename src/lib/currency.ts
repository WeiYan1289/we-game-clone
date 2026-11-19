/**
 * Country → currency mapping and formatting helpers. Pure functions, no I/O.
 * Formatting relies on the built-in Intl APIs rather than hand-rolled symbols.
 */

const EUROZONE = ["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"];

const COUNTRY_CURRENCY: Record<string, string> = {
  // Southeast Asia
  MY: "MYR", SG: "SGD", ID: "IDR", TH: "THB", PH: "PHP", VN: "VND", BN: "BND", KH: "KHR", MM: "MMK", LA: "LAK",
  // East & South Asia
  CN: "CNY", HK: "HKD", MO: "MOP", TW: "TWD", JP: "JPY", KR: "KRW", IN: "INR", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR",
  // Oceania
  AU: "AUD", NZ: "NZD",
  // Middle East & Africa
  AE: "AED", SA: "SAR", QA: "QAR", IL: "ILS", TR: "TRY", EG: "EGP", ZA: "ZAR", NG: "NGN", KE: "KES",
  // Europe (non-euro)
  GB: "GBP", CH: "CHF", NO: "NOK", SE: "SEK", DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON", UA: "UAH", RU: "RUB",
  // Americas
  US: "USD", CA: "CAD", MX: "MXN", BR: "BRL", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN",
  ...Object.fromEntries(EUROZONE.map((c) => [c, "EUR"])),
};

export const DEFAULT_CURRENCY = "USD";

export type CurrencyLookup = { currency: string; fallback: boolean };

/** ISO 3166-1 alpha-2 → ISO 4217. Unknown codes fall back to USD and say so. */
export function getCurrencyForCountry(countryCode: string): CurrencyLookup {
  const currency = COUNTRY_CURRENCY[countryCode.trim().toUpperCase()];
  return currency ? { currency, fallback: false } : { currency: DEFAULT_CURRENCY, fallback: true };
}

export function formatPrice(amount: number, currency: string, locale?: string): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

const displayName = (type: "region" | "currency", code: string, locale = "en") => {
  try {
    return new Intl.DisplayNames([locale], { type }).of(code) ?? code;
  } catch {
    return code;
  }
};

export const countryName = (code: string, locale?: string) => displayName("region", code.toUpperCase(), locale);
export const currencyName = (code: string, locale?: string) => displayName("currency", code, locale);

/** "MY" → "🇲🇾" via Unicode regional indicator symbols. */
export function flagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/[A-Z]/g, (ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** Options for the manual country picker, sorted by English name. */
export const SUPPORTED_COUNTRIES = Object.keys(COUNTRY_CURRENCY)
  .map((code) => ({ code, name: countryName(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));
