"use client";
import { useSelector } from "react-redux";

export const useCurrencyConvert = () => {
  const { rate } = useSelector((state) => state.settings); // Access currency and rate from Redux
  console.log("Conversion rate:", rate);
  const convertCurrency = (number) => {
    return Number((number * rate).toFixed(1));
  };
  return convertCurrency;
};
