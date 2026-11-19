"use client";

import { type ReactNode, useState } from "react";
import { Header } from "./Header";
import { SideNav } from "./SideNav";

/**
 * Client boundary for page-wide UI state. Sections are passed in as
 * `children` so they stay server components.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [currencyOpen, setCurrencyOpen] = useState(false);

  return (
    <>
      <Header onOpenCurrency={() => setCurrencyOpen(true)} />
      {children}
      <SideNav />
      {currencyOpen && null}
    </>
  );
}
