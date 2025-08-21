"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "../redux/slices/product"
import { fetchShops } from "../redux/slices/shops"
import { fetchCategories } from "../redux/slices/categories"
import { testApiEndpoints } from "../services/apiTest"

export const useInitialDataFetch = () => {
  const dispatch = useDispatch()

  const products = useSelector((state) => state.product)
  const shops = useSelector((state) => state.shops)
  const categories = useSelector((state) => state.categories)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log("[v0] Fetching initial data...")

        const testResults = await testApiEndpoints()
        if (testResults) {
          console.log("[v0] API test successful, proceeding with data fetch")
        }

        await Promise.all([dispatch(fetchProducts()), dispatch(fetchShops()), dispatch(fetchCategories())])

        console.log("[v0] Initial data fetch completed")
      } catch (error) {
        console.error("[v0] Error fetching initial data:", error)
      }
    }

    const shouldFetch = !products.products?.length || !shops.shops?.length || !categories.categories?.length

    if (shouldFetch) {
      fetchInitialData()
    }
  }, [dispatch, products.products?.length, shops.shops?.length, categories.categories?.length])

  return {
    products,
    shops,
    categories,
    isLoading: products.loading || shops.loading || categories.loading,
    hasError: products.error || shops.error || categories.error,
  }
}
