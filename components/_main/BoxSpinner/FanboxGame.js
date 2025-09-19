"use client";

import { useState, useEffect } from "react";

import SpinningWheel from "./SpiningWheel";
import { useSelector } from "react-redux";
import { useGameContext } from "@/contexts/gameContext";
import TopUpPopup from "../TopUpPopup";

export default function FanboxGame({ boxConfig: initialBoxConfig }) {
  const {
    // States
    mounted,
    gameState,
    spinResult,
    serverSeedHash,
    clientSeed,
    nonce,
    createSpinApiError,
    sidebarCollapsed,
    isEditingBox,
    currentBoxConfig,
    editableBoxConfig,
    insufficientBalError,
    resellRule,
    cashToCreditConvRate,

    // Setters
    setGameState,
    setSpinResult,
    setServerSeedHash,
    setClientSeed,
    setNonce,
    setCreateSpinApiError,
    setSidebarCollapsed,
    setIsEditingBox,
    setCurrentBoxConfig,
    setEditableBoxConfig,

    // Functions
    handleSpin,
    handleSpinComplete,
    generateAndSetClientSeed,
    resetGame,
  } = useGameContext();

  const [showTopUpPopup, setShowTopUpPopup] = useState(false);

  useEffect(() => {
    setShowTopUpPopup(insufficientBalError);
  }, [insufficientBalError]);

  const handleBoxConfigUpdate = () => {
    try {
      const newConfig = JSON.parse(editableBoxConfig);

      // Validate the new configuration
      if (
        !newConfig.items ||
        !Array.isArray(newConfig.items) ||
        newConfig.items.length === 0
      ) {
        alert(
          "Invalid configuration: items array is required and must not be empty."
        );
        return;
      }

      // Validate each item has required fields
      for (let i = 0; i < newConfig.items.length; i++) {
        const item = newConfig.items[i];
        if (!item.id || !item.name || !item.value || !item.odd) {
          alert(
            `Invalid item at index ${i}: id, name, value, and odds are required.`
          );
          return;
        }
      }

      // Validate odds sum to approximately 1
      const totalOdds = newConfig.items.reduce(
        (sum, item) => sum + item.odd,
        0
      );
      if (Math.abs(totalOdds - 1) > 0.01) {
        const confirmUpdate = confirm(
          `Warning: Total odds sum to ${totalOdds.toFixed(
            3
          )} instead of 1.0. Continue anyway?`
        );
        if (!confirmUpdate) return;
      }

      console.log("📝 Updating box configuration:", newConfig);

      // Update the current box configuration
      setCurrentBoxConfig(newConfig);
      setIsEditingBox(false);

      // Reset game state for new configuration
      setGameState("idle");
      setSpinResult(null);

      console.log("✅ Box configuration updated successfully!");
      alert(
        "Configuration updated successfully! The new items and odds are now active."
      );
    } catch (error) {
      console.error("❌ Invalid JSON:", error);
      alert("Invalid JSON format. Please check your syntax.");
    }
  };

  const resetBoxConfig = () => {
    setEditableBoxConfig(JSON.stringify(currentBoxConfig, null, 2));
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  // console.log("xxxxxxxxx", currentBoxConfig, spinResult);

  return (
    <div className=" bg-[url('/images/spin.jpg')] bg-cover bg-center rounded-3xl mb-5">
      <div className="w-full relative">
        <SpinningWheel
          items={currentBoxConfig.items} // Use current dynamic config
          onSpinComplete={handleSpinComplete}
          onSpin={handleSpin}
          isSpinning={gameState === "spinning"}
          winningItem={spinResult?.winningItem}
          boxPrice={currentBoxConfig?.priceSale || currentBoxConfig?.boxPrice}
          spinResult={spinResult}
          isWaitingForResult={gameState === "waiting"}
          createSpinApiError={createSpinApiError}
          setCreateSpinApiError={setCreateSpinApiError}
          generateAndSetClientSeed={generateAndSetClientSeed}
          clientSeed={clientSeed}
          resellRule={resellRule}
          cashToCreditConvRate={cashToCreditConvRate}
        />
      </div>

      {/* Top Up Popup */}
      {showTopUpPopup && (
        <TopUpPopup
          isOpen={showTopUpPopup}
          onClose={() => setShowTopUpPopup(false)}
        />
      )}
    </div>
  );
}
