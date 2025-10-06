"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

export const useCurrencyFormatter = () => {
  const { currency } = useSelector((state) => state.settings);
  const [formatter, setFormatter] = useState(null);
  const locale = "en-US";

  useEffect(() => {
    if (currency && locale) {
      const newFormatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency || "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setFormatter(newFormatter);
    }
  }, [currency, locale]);

  // Use useCallback and include formatter in dependencies
  const formatCurrency = useCallback(
    (number) => {
      // console.log("Formatting number:", number, "with currency:", currency);
      if (!formatter) return `$${Number(number).toFixed(2)}`; // Fallback
      return formatter.format(Number(number));
    },
    [formatter]
  );

  return formatCurrency;
};
