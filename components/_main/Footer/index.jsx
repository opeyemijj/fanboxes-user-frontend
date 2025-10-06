import Link from "next/link";
import { Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-40 border-t border-gray-200">
      {/* Main Section */}
      <div className="bg-white">
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            {/* Left Section: Navigation Links + Social Links */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-16 gap-8">
              {/* Navigation Links */}
              <div>
                <ul className="space-y-3 text-sm font-medium text-gray-400">
                  <li>
                    <Link
                      href="/mystery-boxes"
                      className="hover:text-[#11F2EB] transition-colors"
                    >
                      Boxes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ambassadors"
                      className="hover:text-[#11F2EB] transition-colors"
                    >
                      Our ambassadors
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="hover:text-[#11F2EB] transition-colors"
                    >
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-[#11F2EB] transition-colors"
                    >
                      Our policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-[#11F2EB] transition-colors"
                    >
                      Reviews
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faqs"
                      className="hover:text-[#11F2EB] transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Links */}
              <div>
                <ul className="space-y-3 text-sm font-medium text-gray-400">
                  <li className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4" />
                    <Link
                      href="https://www.instagram.com/fanboxesuk/"
                      className="hover:text-[#11F2EB] transition-colors"
                      target="_blank"
                    >
                      Instagram
                    </Link>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-4 w-4 relative">
                      <Image
                        src="/images/tiktok.svg"
                        alt="TikTok"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Link
                      href="#"
                      className="hover:text-[#11F2EB] transition-colors"
                    >
                      TikTok
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section: Logo + Payment Methods */}
            <div className="flex flex-col items-start md:items-end space-y-6">
              {/* Logo */}
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <div className="h-12 w-12 relative">
                  <Image
                    src="/favicon.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              {/* Payment Methods */}
              <div className="flex flex-wrap gap-3">
                <div className="h-6 w-9 relative">
                  <Image
                    src="/images/mastercard.svg"
                    alt="Mastercard"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="h-6 w-9 relative">
                  <Image
                    src="/images/visa.svg"
                    alt="Visa"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="h-6 w-9 relative">
                  <Image
                    src="/images/apple-pay.svg"
                    alt="Apple Pay"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="h-6 w-9 relative">
                  <Image
                    src="/images/amex.svg"
                    alt="Amex"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="h-6 w-6 relative">
                  <Image
                    src="/images/bitcoin.svg"
                    alt="Bitcoin"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer Text */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-400 max-w-4xl leading-relaxed">
              All product and company names are trademarks or registered
              trademarks of their respective holders. Use of them does not imply
              any affiliation with or endorsement by them.
            </p>
            <p className="text-xs text-gray-400 max-w-4xl leading-relaxed mt-2">
              The Site is available to Users located all around the world, so it
              is upon you to assess whether visiting the Site or using our
              Services is in compliance with any local laws and regulations.
              Whenever you are visiting our Site or using our Services you will
              need to comply with these Terms and any applicable laws,
              regulations and policies. If any part of the Site or the Services
              is not in compliance with your local laws, you may not use the
              site and the Services. Any such Service will be considered as 'not
              available in your country'.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-6 lg:px-12">
          <p className="text-left text-xs text-gray-400 font-medium">
            COPYRIGHT © FANBOXES LIMITED
          </p>
        </div>
      </div>
    </footer>
  );
}
