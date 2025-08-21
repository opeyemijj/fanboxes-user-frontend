import Link from "next/link"
import { Box, Instagram, Twitter } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/favicon.png"   // or "/favicon.png" depending on what you saved in public/
                alt="Logo"
                width={32}           // same as h-8 (8 * 4px = 32px)
                height={32}
                className="h-8 w-8"
              />
              <span className="font-bold text-2xl text-black">fanboxes</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-black">
                  Mystery boxes
                </Link>
              </li>
              <li>
                <Link href="/ambassadors" className="hover:text-black">
                  Our ambassadors
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  How it works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-black">
                  Our policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4">Social</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Instagram className="h-4 w-4" />
                <Link href="#" className="hover:text-black">
                  Instagram
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Twitter className="h-4 w-4" />
                <Link href="#" className="hover:text-black">
                  TikTok
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="mb-4 sm:mb-0">&copy; COPYRIGHT © FANBOXES LIMITED</p>
            <div className="flex items-center space-x-2">
              <Image src="/images/mastercard.svg" alt="Mastercard" width={36} height={24} />
              <Image src="/images/visa.svg" alt="Visa" width={36} height={24} />
              <Image src="/images/apple-pay.svg" alt="Apple Pay" width={36} height={24} />
              <Image src="/images/amex.svg" alt="Amex" width={36} height={24} />
              <Image src="/images/bitcoin.svg" alt="Bitcoin" width={24} height={24} />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            All product and company names are trademarks or registered trademarks of their respective holders. Use of
            them does not imply any affiliation with or endorsement by them. The Site is available to Users located all
            around the world, so it is upon you to assess whether visiting the Site or using our Services is in
            compliance with any local laws and regulations.
          </p>
        </div>
      </div>
    </footer>
  )
}
