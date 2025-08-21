import { getAllProducts, getShops, getAllCategories } from "./index.js"

export const testApiEndpoints = async () => {
  try {
    console.log("[v0] Testing API endpoints...")

    // Test products endpoint
    const productsResponse = await getAllProducts()
    console.log("[v0] Products response structure:", productsResponse)

    // Test shops/ambassadors endpoint
    const shopsResponse = await getShops()
    console.log("[v0] Shops response structure:", shopsResponse)

    // Test categories endpoint
    const categoriesResponse = await getAllCategories()
    console.log("[v0] Categories response structure:", categoriesResponse)

    return {
      products: productsResponse,
      shops: shopsResponse,
      categories: categoriesResponse,
    }
  } catch (error) {
    console.error("[v0] API test error:", error)
    return null
  }
}
