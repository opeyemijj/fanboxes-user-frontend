"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/product";
import { fetchShops } from "../redux/slices/shops";
import { fetchCategories } from "../redux/slices/categories";

export const useInitialDataFetch = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  const products = useSelector((state) => state.product);
  const shops = useSelector((state) => state.shops);
  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(fetchProducts()),
          dispatch(fetchShops()),
          dispatch(fetchCategories()),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // console.log(
  //   "shops returned:::>>",
  //   shops?.shops?.map(({ title, _id }) => ({ title, _id }))
  // );

  return {
    products,
    shops,
    categories,
    isLoading:
      isLoading || products?.loading || shops?.loading || categories?.loading,
    hasError: products?.error || shops?.error || categories?.error,
  };
};
