"use client";

import React, { createContext, useContext, useState } from "react";

// Support only USD
export type Currency = "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInUsd: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency] = useState<Currency>("USD");

  const setCurrency = () => {
    // No-op since currency is locked to USD
  };

  const formatPrice = (amountInUsd: number) => {
    const safeAmount = Number(amountInUsd) || 0;
    return '$' + safeAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
