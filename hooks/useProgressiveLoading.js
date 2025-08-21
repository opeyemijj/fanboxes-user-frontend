"use client"

import { useState, useEffect } from "react"

export function useProgressiveLoading(sections = [], baseDelay = 500) {
  const [loadingStates, setLoadingStates] = useState(
    sections.reduce((acc, section) => ({ ...acc, [section]: true }), {}),
  )

  useEffect(() => {
    // Stagger the loading completion for different sections
    sections.forEach((section, index) => {
      const delay = baseDelay + index * 300 // 300ms stagger between sections

      setTimeout(() => {
        setLoadingStates((prev) => ({
          ...prev,
          [section]: false,
        }))
      }, delay)
    })
  }, [sections, baseDelay])

  const isLoading = (section) => loadingStates[section] || false
  const isAnyLoading = () => Object.values(loadingStates).some(Boolean)

  return { isLoading, isAnyLoading, loadingStates }
}
