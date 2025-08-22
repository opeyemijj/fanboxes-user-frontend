"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import Link from "next/link";
import PrizePopup from "../PrizePopup";

export default function BoxSpinner({ box }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPrizePopup, setShowPrizePopup] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);

  const handleSpin = () => {
    setIsSpinning(true);

    // Simulate spinning animation
    setTimeout(() => {
      setIsSpinning(false);

      // Select a random prize from the box contents or prize items
      const availablePrizes = box.priceSale || box.prizeItems || [];
      if (availablePrizes.length > 0) {
        const randomPrize =
          availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
        setSelectedPrize(randomPrize);
        setShowPrizePopup(true);
      }
    }, 3000);
  };

  const closePrizePopup = () => {
    setShowPrizePopup(false);
    setSelectedPrize(null);
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ambassador Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#11F2EB] rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src={box.image?.url || "/placeholder.svg"}
                alt={box.ambassadorName}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{box.ambassadorName}</h1>
              <p className="text-gray-500">{box.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="bg-gray-100 border-gray-200 rounded-full"
            >
              <span className="mr-2">🔔</span>
              GET UPDATES
            </Button>
            <Link href={`/ambassadors/${box.ambassadorSlug}`}>
              <Button
                variant="outline"
                className="bg-gray-100 border-gray-200 rounded-full"
              >
                VIEW PROFILE
                <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Spinning Area */}
        <div className="relative w-full h-[400px] bg-black overflow-hidden flex items-center justify-center rounded-lg mb-8">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-teal-600/60 to-purple-900/80" />

          {/* Floating Prize Items */}
          <div
            className={`relative z-10 flex flex-wrap items-center justify-center gap-8 max-w-6xl mx-auto px-4 transition-transform duration-1000 ${
              isSpinning ? "animate-spin" : ""
            }`}
          >
            {box.prizeItems?.map((item, index) => (
              <div
                key={index}
                className={`relative transition-all duration-1000 ${
                  isSpinning ? "animate-bounce" : ""
                }`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={item.size || 120}
                  height={item.size || 120}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            ))}

            {/* Central Spin Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={handleSpin}
                disabled={isSpinning}
                variant="cyan"
                className="h-20 w-48 rounded-full font-bold text-lg shadow-lg shadow-cyan-500/50 disabled:opacity-50 transition-all duration-300"
              >
                <div className="flex items-center">
                  {isSpinning ? "SPINNING..." : "SPIN FOR"}
                  <span className="mx-2">⬢</span>
                  {box.spinCost || "100"}
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Popup */}
      <PrizePopup
        isOpen={showPrizePopup}
        onClose={closePrizePopup}
        prize={selectedPrize}
        spinCost={box.spinCost}
      />
    </>
  );
}
