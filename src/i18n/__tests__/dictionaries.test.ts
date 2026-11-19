import { describe, expect, it } from "vitest";
import { LOCALES } from "../config";
import { dictionaries } from "../dictionaries";

/** Flattens nested objects/arrays into dotted key paths with their value types. */
function shape(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [`${prefix}[]:${value.length}`, ...value.flatMap((v, i) => shape(v, `${prefix}[${i}]`))];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => shape(v, prefix ? `${prefix}.${k}` : k));
  }
  return [`${prefix}:${typeof value}`];
}

describe("dictionaries", () => {
  const reference = shape(dictionaries["zh-CN"]);

  it.each(LOCALES.filter((l) => l !== "zh-CN"))("%s has exactly the same keys and list lengths as zh-CN", (locale) => {
    expect(shape(dictionaries[locale])).toEqual(reference);
  });

  it.each(LOCALES)("%s has no empty strings", (locale) => {
    const walk = (v: unknown, path: string): string[] =>
      typeof v === "string"
        ? v.trim()
          ? []
          : [path]
        : v && typeof v === "object"
          ? Object.entries(v).flatMap(([k, c]) => walk(c, `${path}.${k}`))
          : [];
    expect(walk(dictionaries[locale], locale)).toEqual([]);
  });
});
