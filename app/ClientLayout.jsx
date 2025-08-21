"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/components/AuthProvider"

export default function ClientLayout({ children }) {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme")
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initialTheme = savedTheme || systemTheme

    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  useEffect(() => {
    // Listen for theme changes from the header toggle
    const handleThemeChange = (event) => {
      const newTheme = event.detail.theme
      setTheme(newTheme)
      document.documentElement.classList.toggle("dark", newTheme === "dark")
      localStorage.setItem("theme", newTheme)
    }

    window.addEventListener("themeChange", handleThemeChange)
    return () => window.removeEventListener("themeChange", handleThemeChange)
  }, [])

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
