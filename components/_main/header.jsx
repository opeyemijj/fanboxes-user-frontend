import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/Button/index"
import { Box, Hexagon } from "lucide-react"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
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
/>              <span className="font-bold text-2xl">fanboxes</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/mystery-boxes">
                <Button variant="ghost" className="text-sm font-semibold text-gray-600 hover:bg-gray-100">
                  MYSTERY BOXES
                </Button>
              </Link>
              <Link href="/ambassadors">
                <Button variant="ghost" className="text-sm font-semibold text-gray-600 hover:bg-gray-100">
                  OUR AMBASSADORS
                </Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="hidden sm:flex items-center space-x-2 border-gray-200 bg-transparent">
              <Hexagon className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">x1,200</span>
            </Button>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline font-semibold text-sm">WILLIAM</span>
              <Image
                src="/images/user-william.png"
                alt="User Avatar"
                width={32}
                height={32}
                className="rounded-full bg-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
