"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useGeoCurrency } from "@/hooks/useGeoCurrency";
import { type Locale, localeForCountry, localePath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { readSession, removeSession, writeSession } from "@/lib/session";
import { CurrencyModal } from "../currency/CurrencyModal";
import { FullPage } from "../paging/FullPage";
import { InstallPrompt } from "../pwa/InstallPrompt";
import { Header } from "./Header";
import { SideNav } from "./SideNav";

export type ShellDict = Pick<Dictionary, "header" | "rail" | "region" | "download" | "pwa">;

/** Set before a locale switch so the modal reopens (with a confirmation) after the reload. */
const REOPEN_KEY = "wegame:region-reopen";

const noopSubscribe = () => () => {};
/** Reads the flag without an effect; `false` on the server so hydration matches. */
const useReopenFlag = () =>
  useSyncExternalStore(noopSubscribe, () => readSession<boolean>(REOPEN_KEY) === true, () => false);

/**
 * Client boundary for page-wide UI state; sections arrive as `children` so
 * they stay server components.
 *
 * Localisation flow: a fresh location result (detect or manual pick) maps the
 * country to a page language. If it differs from the current one we navigate
 * to that locale's URL — a different root layout, so the browser loads the new
 * page; the geo result and "reopen the modal" flag ride along in sessionStorage.
 */
export function AppShell({ locale, dict, children }: { locale: Locale; dict: ShellDict; children: ReactNode }) {
  // After a locale switch reloaded the page, the modal reopens showing "switched to your language".
  const reopened = useReopenFlag();
  // null = the user hasn't opened/closed anything yet, so fall back to the reopen flag.
  const [open, setOpen] = useState<boolean | null>(null);
  const [switched, setSwitched] = useState<boolean | null>(null);
  const regionOpen = open ?? reopened;
  const languageSwitched = switched ?? reopened;
  const geo = useGeoCurrency();
  const switchOnResult = useRef(false);

  const closeRegion = () => {
    removeSession(REOPEN_KEY);
    setOpen(false);
  };

  const goToLocale = useCallback(
    (target: Locale, reopen: boolean) => {
      if (target === locale) return;
      if (reopen) writeSession(REOPEN_KEY, true);
      window.location.assign(localePath(target));
    },
    [locale],
  );

  useEffect(() => {
    if (geo.state.status !== "success" || !switchOnResult.current) return;
    switchOnResult.current = false;
    goToLocale(localeForCountry(geo.state.countryCode ?? ""), true);
  }, [geo.state, goToLocale]);

  const locate = () => {
    switchOnResult.current = true;
    setSwitched(false);
    geo.locate();
  };

  const chooseCountry = (code: string) => {
    switchOnResult.current = true;
    setSwitched(false);
    geo.chooseCountry(code);
  };

  const currency = geo.state.status === "success" ? geo.state.currency : undefined;

  return (
    <>
      <Header dict={dict.header} downloadDict={dict.download} onOpenRegion={() => setOpen(true)} regionBadge={currency} />
      <FullPage overlay={<SideNav dict={dict.rail} />}>{children}</FullPage>
      <InstallPrompt dict={dict.pwa} />
      {regionOpen && (
        <CurrencyModal
          state={geo.state}
          dict={dict.region}
          locale={locale}
          languageSwitched={languageSwitched}
          onLocate={locate}
          onChooseCountry={chooseCountry}
          onChangeLocale={(l) => goToLocale(l, false)}
          onClose={closeRegion}
        />
      )}
    </>
  );
}
