import type { Locale } from "../config";
import { en } from "./en";
import { id } from "./id";
import { ms } from "./ms";
import { type Dictionary, zhCN } from "./zh-CN";

export type { Dictionary };

/**
 * All dictionaries are small (a few KB), so they are imported statically.
 * They are only read by server components; client components receive the
 * slices they need as props, so translations never bloat the JS bundle.
 */
export const dictionaries: Record<Locale, Dictionary> = { "zh-CN": zhCN, en, ms, id };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
