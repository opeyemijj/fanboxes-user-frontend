"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/Button"
import { Hexagon } from "lucide-react"
import TopUpPopup from "../TopUpPopup"
import { useAuth } from "@/components/AuthProvider"

export default function Header() {
  const [showTopUpPopup, setShowTopUpPopup] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    const themeValue = newTheme ? "dark" : "light"
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme: themeValue } }))
  }

  const handleLogout = () => {
    logout()
    setShowProfileDropdown(false)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/favicon.png" alt="Logo" width={32} height={32} className="h-8 w-8" />
                <span className="font-bold text-2xl dark:text-white">fanboxes</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-4">
                <Link href="/mystery-boxes">
                  <Button
                    variant="ghost"
                    className={`text-sm font-semibold transition-colors ${
                      pathname === "/mystery-boxes"
                        ? "bg-black text-white hover:bg-black hover:text-[#11F2EB]"
                        : "bg-[#EFEFEF] text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    }`}
                  >
                    MYSTERY BOXES
                  </Button>
                </Link>
                <Link href="/ambassadors">
                  <Button
                    variant="ghost"
                    className={`text-sm font-semibold transition-colors ${
                      pathname === "/ambassadors"
                        ? "bg-black text-white hover:bg-black hover:text-[#11F2EB]"
                        : "bg-[#EFEFEF] text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    }`}
                  >
                    OUR AMBASSADORS
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleTheme}
                variant="ghost"
                className="w-10 h-10 p-0 rounded-full bg-[#EFEFEF] hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <span className="text-white text-lg">☀️</span>
                ) : (
                  <span className="text-gray-700 text-lg">🌙</span>
                )}
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => setShowTopUpPopup(true)}
                    variant="outline"
                    className="hidden sm:flex items-center space-x-2 border-gray-200 bg-transparent hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <span className="font-semibold dark:text-white">x1,200</span>
                    <Hexagon className="h-4 w-4 text-gray-500 dark:text-white" />
                  </Button>
                  <div className="relative">
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                      <span className="hidden sm:inline font-semibold text-sm dark:text-white">
                        {user?.name || "USER"}
                      </span>
                      <Image
                        src={user?.avatar || "/images/user-william.png"}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full bg-gray-300 dark:bg-gray-800"
                      />
                    </div>
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-sm font-semibold bg-[#EFEFEF] text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
                    >
                      LOGIN
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      variant="ghost"
                      className="text-sm font-semibold bg-[#EFEFEF] text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
                    >
                      SIGN UP
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Top Up Popup */}
      <TopUpPopup isOpen={showTopUpPopup} onClose={() => setShowTopUpPopup(false)} />
    </>
  )
}

export { Header }
