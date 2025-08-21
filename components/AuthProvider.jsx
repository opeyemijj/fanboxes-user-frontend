"use client"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("userData")

    if (authStatus === "true") {
      setIsAuthenticated(true)
      if (userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser({ name: "WILLIAM", avatar: "/images/user-william.png" })
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData = null) => {
    setIsAuthenticated(true)
    const defaultUser = { name: "WILLIAM", avatar: "/images/user-william.png" }
    const user = userData || defaultUser
    setUser(user)
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userData", JSON.stringify(user))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.setItem("isAuthenticated", "false")
    localStorage.removeItem("userData")
  }

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
