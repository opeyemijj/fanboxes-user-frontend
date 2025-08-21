"use client"
import { useState } from "react"
import { Button } from "@/components/Button"
import { X, ArrowRight, Bitcoin } from "lucide-react"

export default function TopUpPopup({ isOpen, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("card")

  if (!isOpen) return null

  const presetAmounts = [50, 100, 250, 500, 1000]

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setSelectedAmount(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* View Profile Link */}
        <div className="absolute top-6 right-16">
          <button className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center space-x-1">
            <span>VIEW PROFILE</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black mb-8">Top up your account</h2>

        {/* Credit/Debit Card Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-black mb-4">Credit / Debit card</h3>

          {/* Payment Method Icons */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-6 bg-red-500 rounded flex items-center justify-center">
              <div className="w-4 h-3 bg-red-600 rounded-full"></div>
              <div className="w-4 h-3 bg-orange-400 rounded-full -ml-2"></div>
            </div>
            <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
              VISA
            </div>
            <div className="w-8 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold">
              Pay
            </div>
            <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
              AMEX
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Select how much you want to deposit</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedAmount === amount
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  €{amount}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <input
              type="text"
              placeholder="Or enter amount here"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Crypto Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-black flex items-center space-x-2">
              <span>Crypto</span>
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Bitcoin className="h-4 w-4 text-white" />
              </div>
            </h3>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        {/* Select Method Button */}
        <Button
          variant="outline"
          className="w-full mb-4 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium bg-transparent"
        >
          SELECT METHOD
        </Button>

        {/* Deposit Button */}
        <Button variant="cyan" className="w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2">
          <span>DEPOSIT</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
