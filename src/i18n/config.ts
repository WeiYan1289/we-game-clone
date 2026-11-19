/** Supported page languages. zh-CN mirrors the original site and is served at "/". */
export const LOCALES = ["zh-CN", "en", "ms", "id"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-CN";

export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-CN": "简体中文",
  en: "English",
  ms: "Bahasa Melayu",
  id: "Bahasa Indonesia",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

const COUNTRY_LOCALE: Record<string, Locale> = {
  CN: "zh-CN",
  HK: "zh-CN",
  TW: "zh-CN",
  MO: "zh-CN",
  MY: "ms",
  BN: "ms",
  ID: "id",
};

/** Detected country → page language. Anywhere unmapped gets English. */
export function localeForCountry(countryCode: string): Locale {
  return COUNTRY_LOCALE[countryCode.trim().toUpperCase()] ?? "en";
}

/** URL for a locale's home page; the default locale lives at the root. */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}`;
}
