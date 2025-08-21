"use client"
import Image from "next/image"
import { Button } from "@/components/Button"
import { X, Check, Hexagon, ShoppingCart } from "lucide-react"

export default function PrizePopup({ isOpen, onClose, prize, spinCost }) {
  if (!isOpen || !prize) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span>CLOSE</span>
            <X className="h-4 w-4" />
          </div>
        </button>

        <div className="flex items-start space-x-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Product Title */}
            <h2 className="text-4xl font-bold text-black mb-2">{prize.name}</h2>

            {/* Brand */}
            <p className="text-xl text-gray-500 mb-4">{prize.brand}</p>

            {/* Price Badge */}
            <div className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
              ${prize.price?.toLocaleString() || "250"}
            </div>

            {/* Status Badges */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500" />
                <span className="font-medium">100% AUTHENTIC</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500" />
                <span className="font-medium">IN STOCK</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-gray-700 text-sm leading-relaxed mb-8 max-w-md">
              <p>
                Beautiful rich sound – less background noise. Apple AirPods Pro are built around the H2 chip, and its
                algorithms play a massive part in producing vivid audio. It processes sound quickly for higher fidelity
                audio and works with the custom-built driver and amplifier for crisp, distortion-free music.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium bg-transparent"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>ADD TO CART</span>
              </Button>

              <Button
                className="flex items-center space-x-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-black rounded-lg font-bold"
                onClick={onClose}
              >
                <span>SPIN FOR</span>
                <Hexagon className="h-4 w-4" />
                <span>{spinCost || "100"}</span>
              </Button>
            </div>
          </div>

          {/* Right Content - Product Image */}
          <div className="flex-shrink-0">
            <div className="w-80 h-80 bg-gray-50 rounded-2xl flex items-center justify-center p-8">
              <Image
                src={prize.image || "/images/airpods-pro.png"}
                alt={prize.name}
                width={280}
                height={280}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
