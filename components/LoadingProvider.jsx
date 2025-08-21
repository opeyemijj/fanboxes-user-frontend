"use client"

import { createContext, useContext, useState } from "react"

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [loadingStates, setLoadingStates] = useState({})

  const setLoading = (key, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }))
  }

  const isLoading = (key) => {
    return loadingStates[key] || false
  }

  const simulateLoading = async (key, duration = 2000) => {
    setLoading(key, true)
    await new Promise((resolve) => setTimeout(resolve, duration))
    setLoading(key, false)
  }

  return (
    <LoadingContext.Provider
      value={{
        setLoading,
        isLoading,
        simulateLoading,
        loadingStates,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
