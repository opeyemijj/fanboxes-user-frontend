"use client";

import { useState, useEffect } from "react";
import SpinningWheel from "./SpiningWheel";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Button } from "@/components/Button";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "./GameCards";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toastSuccess, toastError, toastLoading } from "@/lib/toast";

export default function FanboxGame({ boxConfig: initialBoxConfig }) {
  const user = useSelector((state) => state.user);
  const router = useRouter();

  // Game States
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState("idle"); // idle, spinning, completed
  const [spinResult, setSpinResult] = useState(null);
  const [serverSeedHash, setServerSeedHash] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState(1);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isEditingBox, setIsEditingBox] = useState(false);

  // Make box config dynamic and editable
  const [currentBoxConfig, setCurrentBoxConfig] = useState(initialBoxConfig);
  const [editableBoxConfig, setEditableBoxConfig] = useState(
    JSON.stringify(initialBoxConfig, null, 2)
  );
  console.log("🎲 Initial box configuration:", initialBoxConfig);

  useEffect(() => {
    setMounted(true);
    // Generate initial client seed
    const initialClientSeed = Math.random().toString(36).substring(2, 15);
    setClientSeed(initialClientSeed);
    console.log("🎮 Game initialized with client seed:", initialClientSeed);
  }, []);

  const handleSpin = async () => {
    console.log("🚀 Starting spin process...");
    console.log("📦 Using current box config:", currentBoxConfig);
    setGameState("spinning");

    try {
      //get user token from redux later. for now, get from local storage
      const token = user?.user?.token || localStorage.getItem("token");
      if (!token) {
        router.push("/login");

        toastError("Please log in to spin the wheel.");
        return;
      }

      // Call the spin API with current box configuration
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/admin/spin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            clientSeed,
            nonce,
            boxId: currentBoxConfig._id,
            items: currentBoxConfig.items, // Send current items to API
          }),
        }
      );

      const result = await response.json();
      // const simulateApiCallAndReturnWinningItem = async () => {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       const randomItem =
      //         currentBoxConfig.items[
      //           Math.floor(Math.random() * currentBoxConfig.items.length)
      //         ];

      //       resolve({
      //         winningItem: randomItem,
      //         serverSeedHash: "simulatedServerSeedHash123456",
      //         verification: {
      //           serverSeed: "simulatedServerSeed123456",
      //           clientSeed,
      //           hash: "simulatedHash123456",
      //           normalized: Math.random(),
      //           nonce,
      //         },
      //         success: true,
      //       });
      //     }, 2000);
      //   });
      // };
      // Simulate server seed and hash
      // const result = await simulateApiCallAndReturnWinningItem();
      console.log("📡 Received spin result from API:", result);
      if (!result.success) {
        setGameState("idle");
        throw new Error(result.message || "Spin failed");
      }

      console.log("result.data", result.data);
      setSpinResult(result.data);
      setServerSeedHash(result?.data.serverSeedHash);
      setNonce((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error during spin:", error);
      setGameState("idle");
    }
  };

  const handleSpinComplete = () => {
    console.log("🎊 Spin animation completed");
    setGameState("completed");
  };

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
  console.log("xxxxxxxxx", currentBoxConfig, spinResult);

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
        />
      </div>
    </div>
  );
}
