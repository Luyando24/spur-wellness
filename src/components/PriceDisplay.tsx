"use client";

import { CSSProperties } from "react";
import { useCurrency } from "./CurrencyContext";

export default function PriceDisplay({ amount, className = "", style }: { amount: number, className?: string, style?: CSSProperties }) {
  const { formatPrice } = useCurrency();
  return <span className={className} style={style}>{formatPrice(amount)}</span>;
}
