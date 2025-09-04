"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/product";
import { fetchShops } from "../redux/slices/shops";
import { fetchCategories } from "../redux/slices/categories";

export const useInitialDataFetch = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false); // ✅ prevents multiple calls

  const products = useSelector((state) => state.product);
  const shops = useSelector((state) => state.shops);
  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    if (hasFetched.current) return; // ✅ already called once
    hasFetched.current = true;

    const fetchInitialData = async () => {
      console.log("Check how many time");

      try {
        console.log("[v0] Fetching initial data...");

        // const testResults = await testApiEndpoints();
        // if (testResults) {
        //   console.log("[v0] API test successful, proceeding with data fetch");
        // }

        await Promise.all([
          dispatch(fetchProducts()),
          dispatch(fetchShops()),
          dispatch(fetchCategories()),
        ]);

        console.log("[v0] Initial data fetch completed");
      } catch (error) {
        console.error("[v0] Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch]); // ✅ runs only once

  return {
    products,
    shops,
    categories,
    isLoading: products?.loading || shops?.loading || categories?.loading,
    hasError: products?.error || shops?.error || categories?.error,
  };
};
