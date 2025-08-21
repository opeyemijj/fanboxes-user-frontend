"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Box } from "lucide-react"
import TopUpPopup from "../TopUpPopup"
import { useState } from "react"
import Image from "next/image"

export default function Header() {
  const [showTopUpPopup, setShowTopUpPopup] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link href="/home" className="flex items-center space-x-2">
              <Image 
  src="/favicon.png"   // or "/favicon.png" depending on what you saved in public/
  alt="Logo"
  width={32}           // same as h-8 (8 * 4px = 32px)
  height={32}
  className="h-8 w-8"
/>
              <span className="font-bold text-2xl">fanboxes</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-2">
              <Link href="/mystery-boxes">
                <Button variant="ghost" className="text-sm font-semibold text-gray-800 bg-gray-100">
                  MYSTERY BOXES
                </Button>
              </Link>
              <Link href="/ambassadors">
                <Button variant="ghost" className="text-sm font-semibold text-gray-500 hover:bg-gray-100">
                  OUR AMBASSADORS
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" className="text-sm font-semibold text-gray-500 hover:bg-gray-100">
              SIGN UP
            </Button>
            <Button
              onClick={() => setShowTopUpPopup(true)}
              className="text-sm font-semibold bg-gray-200 text-black hover:bg-gray-300"
            >
              x1,200
            </Button>
            <Button className="text-sm font-semibold bg-gray-200 text-black hover:bg-gray-300">LOGIN</Button>
          </div>
        </div>
      </div>
      {/* Top Up Popup */}
      <TopUpPopup isOpen={showTopUpPopup} onClose={() => setShowTopUpPopup(false)} />
    </header>
  )
}
