"use client";

import { type ReactNode, useState } from "react";
import { useGeoCurrency } from "@/hooks/useGeoCurrency";
import { CurrencyModal } from "../currency/CurrencyModal";
import { InstallPrompt } from "../pwa/InstallPrompt";
import { Header } from "./Header";
import { SideNav } from "./SideNav";

/**
 * Client boundary for page-wide UI state. Sections are passed in as
 * `children` so they stay server components.
 *
 * Geo/currency state lives here (not in the modal) so the result survives
 * closing the modal and can be surfaced in the header.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const geo = useGeoCurrency();
  const currencyCode = geo.state.status === "success" ? geo.state.currency : undefined;

  return (
    <>
      <Header onOpenCurrency={() => setCurrencyOpen(true)} currencyCode={currencyCode} />
      {children}
      <SideNav />
      <InstallPrompt />
      {currencyOpen && (
        <CurrencyModal
          state={geo.state}
          onLocate={geo.locate}
          onChooseCountry={geo.chooseCountry}
          onClose={() => setCurrencyOpen(false)}
        />
      )}
    </>
  );
}
