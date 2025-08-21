"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/Button"
import { Hexagon, ChevronDown, User, Package, RotateCcw, Settings, LogOut } from "lucide-react"
import TopUpPopup from "../TopUpPopup"
import { useAuth } from "@/components/AuthProvider"

export default function Header() {
  const [showTopUpPopup, setShowTopUpPopup] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setShowProfileDropdown(false)
  }

  const dropdownItems = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: RotateCcw, label: "My Spins", href: "/spins" },
    { icon: Settings, label: "Account Settings", href: "/settings" },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/favicon.png" alt="Logo" width={32} height={32} className="h-8 w-8" />
                <span className="font-bold text-2xl">fanboxes</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-4">
                <Link href="/mystery-boxes">
                  <Button
                    variant="ghost"
                    className={`text-sm font-semibold transition-colors ${
                      pathname === "/mystery-boxes"
                        ? "bg-black text-white hover:bg-black hover:text-[#11F2EB]"
                        : "bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white"
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
                        : "bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white"
                    }`}
                  >
                    OUR AMBASSADORS
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => setShowTopUpPopup(true)}
                    variant="outline"
                    className="hidden sm:flex items-center space-x-2 border-gray-200 bg-transparent hover:bg-[#11F2EB] hover:text-white hover:border-[#11F2EB] transition-colors"
                  >
                    <span className="font-semibold">x1,200</span>
                    <Hexagon className="h-4 w-4 text-gray-500" />
                  </Button>
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                      <span className="hidden sm:inline font-semibold text-sm">WILLIAM</span>
                      <Image
                        src="/images/user-william.png"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full bg-gray-300"
                      />
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <Image
                              src="/images/user-william.png"
                              alt="User Avatar"
                              width={40}
                              height={40}
                              className="rounded-full bg-gray-300"
                            />
                            <div>
                              <p className="font-semibold text-sm text-gray-900">William</p>
                              <p className="text-xs text-gray-500">william@example.com</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-1">
                          {dropdownItems.map((item, index) => (
                            <Link
                              key={index}
                              href={item.href}
                              onClick={() => setShowProfileDropdown(false)}
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#11F2EB] hover:text-white transition-colors"
                            >
                              <item.icon className="h-4 w-4 text-gray-500" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-sm font-semibold bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white transition-colors"
                    >
                      LOGIN
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      variant="ghost"
                      className="text-sm font-semibold bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white transition-colors"
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
