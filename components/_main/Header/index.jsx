"use client";
import React, { useEffect, useState, useRef } from "react";
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
  Receipt,
  ShoppingCart,
} from "lucide-react";
import TopUpPopup from "../TopUpPopup";
import { useAuth } from "@/components/AuthProvider";
import { useSelector } from "react-redux";
import HeaderWalletBalance from "./HeaderWalletBalance";
import { selectDirectBuyItems } from "@/redux/slices/cartOrder";
import CurrencySelect from "./LanguageSelect";

function Header() {
  const userData = useSelector((state) => state.user);
  const cartItems = useSelector(selectDirectBuyItems);
  const [showTopUpPopup, setShowTopUpPopup] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();
  const { logout } = useAuth();

  // Ref for the profile dropdown container
  const dropdownRef = useRef(null);

  // Calculate total items in cart
  const totalCartItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // Set mounted flag on client only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setUser(userData?.user);
    setIsLoggedIn(userData?.isAuthenticated && userData?.user?.token);
  }, [userData]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
  };

  const dropdownItems = [
    { icon: User, label: "My Profile", href: "/account?tab=profile" },
    { icon: Package, label: "My Orders", href: "/account?tab=orders" },
    { icon: RotateCcw, label: "My Spins", href: "/account?tab=spins" },
    {
      icon: Receipt,
      label: "Transaction History",
      href: "/account?tab=transactions",
    },
    {
      icon: Settings,
      label: "Account Settings",
      href: "/account?tab=settings",
    },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Full header skeleton
  const HeaderSkeleton = () => (
    <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - No skeleton needed */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/favicon.png"
                alt="Logo"
                width={28}
                height={28}
                className="h-7 w-7 lg:h-8 lg:w-8"
              />
              <span className="font-bold text-xl lg:text-2xl">fanboxes</span>
            </Link>
            {/* Desktop nav skeleton */}
            <nav className="hidden lg:flex items-center space-x-4">
              <div className="w-20 h-9 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-9 bg-gray-200 rounded animate-pulse"></div>
            </nav>
          </div>

          {/* Desktop right section skeleton */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Currency selector skeleton */}
            <div className="w-24 h-9 bg-gray-200 rounded-lg animate-pulse"></div>

            {/* Cart skeleton */}
            <div className="w-9 h-9 bg-gray-200 rounded animate-pulse"></div>

            {/* Wallet balance skeleton */}
            <div className="w-20 h-9 bg-gray-200 rounded animate-pulse"></div>

            {/* User profile skeleton */}
            <div className="flex items-center space-x-2">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Mobile right section skeleton */}
          <div className="lg:hidden flex items-center space-x-2">
            <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-9 h-9 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-9 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-9 h-9 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );

  // Show skeleton until mounted
  if (!isMounted) {
    return <HeaderSkeleton />;
  }

  // Render actual header after mounting
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/favicon.png"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 lg:h-8 lg:w-8"
                />
                <span className="font-bold text-xl lg:text-2xl">fanboxes</span>
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
                    BOXES
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
              {/* Currency Selector */}
              <CurrencySelect />

              {/* Cart Icon for Desktop */}
              {totalCartItems > 0 && (
                <Link href="/cart" className="relative">
                  <Button
                    variant="ghost"
                    className="relative p-2 text-gray-600 hover:bg-[#EFEFEF] hover:text-[#11F2EB] transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />

                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {totalCartItems > 99 ? "99+" : totalCartItems}
                    </span>
                  </Button>
                </Link>
              )}

              {isLoggedIn && user ? (
                <>
                  <Button
                    onClick={() => setShowTopUpPopup(true)}
                    variant="outline"
                    className="flex items-center border-gray-200 bg-transparent hover:bg-[#11F2EB] hover:text-white hover:border-[#11F2EB] transition-colors"
                  >
                    <HeaderWalletBalance
                      handleLogout={handleLogout}
                      availableBalance={userData?.user?.availableBalance}
                    />
                    <Hexagon className="h-4 w-4 text-gray-500" />
                  </Button>
                  <div className="relative" ref={dropdownRef}>
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
            <div className="lg:hidden flex items-center space-x-2">
              {/* Currency Selector for Mobile */}
              <CurrencySelect />

              {/* Cart Icon for Mobile */}
              {totalCartItems > 0 && (
                <Link href="/cart" className="relative">
                  <Button
                    variant="ghost"
                    className="relative p-2 text-gray-600 hover:bg-[#EFEFEF] hover:text-[#11F2EB] transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />

                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {totalCartItems > 9 ? "9+" : totalCartItems}
                    </span>
                  </Button>
                </Link>
              )}

              {isLoggedIn && user && (
                <Button
                  onClick={() => setShowTopUpPopup(true)}
                  variant="outline"
                  className="flex items-center border-gray-200 bg-transparent hover:bg-[#11F2EB] hover:text-white hover:border-[#11F2EB] transition-colors p-2"
                >
                  <HeaderWalletBalance
                    handleLogout={handleLogout}
                    availableBalance={userData?.user?.availableBalance}
                    isMobile={true}
                  />
                  <Hexagon className="h-4 w-4 text-gray-500 ml-1" />
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
                    BOXES
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

                {/* Mobile Cart Link */}
                <Link href="/cart">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-sm font-semibold transition-colors ${
                      pathname === "/cart"
                        ? "bg-black text-white hover:bg-black hover:text-[#11F2EB]"
                        : "bg-[#EFEFEF] text-gray-600 hover:bg-[#11F2EB] hover:text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingCart className="h-4 w-4" />
                      <span>
                        My Cart {totalCartItems > 0 && `(${totalCartItems})`}
                      </span>
                    </div>
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

export default React.memo(Header);
