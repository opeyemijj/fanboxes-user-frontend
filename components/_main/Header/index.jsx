"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import {
  Hexagon,
  ChevronDown,
  User,
  Package,
  RotateCcw,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import TopUpPopup from "../TopUpPopup";
import { useAuth } from "@/components/AuthProvider";
import { useSelector } from "react-redux";

export default function Header() {
  const userData = useSelector((state) => state.user);
  const [showTopUpPopup, setShowTopUpPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    setUser(userData?.user);
    setIsLoggedIn(userData?.isAuthenticated && userData?.user?.token);
  }, [userData]);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
  };

  const dropdownItems = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: RotateCcw, label: "My Spins", href: "/spins" },
    { icon: Settings, label: "Account Settings", href: "/settings" },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/favicon.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="font-bold text-2xl">fanboxes</span>
              </Link>
              <nav className="hidden lg:flex items-center space-x-4">
                <Link href="/mystery-boxes" prefetch={false}>
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

            {/* Desktop Navigation - Show on large screens only */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn && user ? (
                <>
                  <Button
                    onClick={() => setShowTopUpPopup(true)}
                    variant="outline"
                    className="flex items-center space-x-2 border-gray-200 bg-transparent hover:bg-[#11F2EB] hover:text-white hover:border-[#11F2EB] transition-colors"
                  >
                    <span className="font-semibold">x1,200</span>
                    <Hexagon className="h-4 w-4 text-gray-500" />
                  </Button>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                      <span className="font-semibold text-sm">
                        {user?.firstName || ""}
                      </span>
                      <Image
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&size=128&rounded=true`
                        }
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
                              src={
                                user?.avatar ||
                                `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&size=128&rounded=true`
                              }
                              alt="User Avatar"
                              width={40}
                              height={40}
                              className="rounded-full bg-gray-300"
                            />
                            <div className="text-left">
                              <p className="font-semibold text-sm text-gray-900">
                                {user?.firstName + " " + user?.lastName || ""}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user?.email || ""}
                              </p>
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

            {/* Mobile menu button - Show on medium and small screens */}
            <div className="lg:hidden flex items-center">
              {isLoggedIn && user && (
                <Button
                  onClick={() => setShowTopUpPopup(true)}
                  variant="outline"
                  className="mr-4 flex items-center space-x-2 border-gray-200 bg-transparent hover:bg-[#11F2EB] hover:text-white hover:border-[#11F2EB] transition-colors"
                >
                  <span className="font-semibold">x1,200</span>
                  <Hexagon className="h-4 w-4 text-gray-500" />
                </Button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-md"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Show on medium and small screens */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/mystery-boxes" prefetch={false}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-sm font-semibold transition-colors ${
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
                    className={`w-full justify-start text-sm font-semibold transition-colors ${
                      pathname === "/ambassadors"
                        ? "bg-black text-white hover:bg-black hover:text-[#11F2EB]"
                        : "bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white"
                    }`}
                  >
                    OUR AMBASSADORS
                  </Button>
                </Link>

                {isLoggedIn && user ? (
                  <>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Image
                          src={
                            user?.avatar ||
                            `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&size=128&rounded=true`
                          }
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className="rounded-full bg-gray-300"
                        />
                        <div className="text-left">
                          <p className="font-semibold text-sm text-gray-900">
                            {user?.firstName + " " + user?.lastName || ""}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>

                      {dropdownItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#11F2EB] hover:text-white transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-4 border-t border-gray-200 flex flex-col space-y-2">
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-sm font-semibold bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        LOGIN
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-sm font-semibold bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        SIGN UP
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Top Up Popup */}
      <TopUpPopup
        isOpen={showTopUpPopup}
        onClose={() => setShowTopUpPopup(false)}
      />
    </>
  );
}
