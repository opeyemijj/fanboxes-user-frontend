import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.fanboxes.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export const apiEndpoints = {
  products: "/products", // boxes data
  shops: "/shops", // influencers data
  ambassadors: "/ambassadors",
  categories: "/categories",
}

export const apiService = {
  // Fetch products (boxes)
  fetchProducts: async () => {
    try {
      const response = await api.get(apiEndpoints.products)
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
      throw error
    }
  },

  // Fetch shops (influencers)
  fetchShops: async () => {
    try {
      const response = await api.get(apiEndpoints.shops)
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching shops:", error)
      throw error
    }
  },

  // Fetch ambassadors
  fetchAmbassadors: async () => {
    try {
      const response = await api.get(apiEndpoints.ambassadors)
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching ambassadors:", error)
      throw error
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await api.get(apiEndpoints.categories)
      return response.data
    } catch (error) {
      console.error("[v0] Error fetching categories:", error)
      throw error
    }
  },
}

export default api
