"use client";

import { useState, useEffect } from "react";
import SpinningWheel from "./SpiningWheel";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Button } from "@/components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./GameCards";

export default function FanboxGame({ boxConfig: initialBoxConfig }) {
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
      // Call the spin API with current box configuration
      // const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/spin", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     clientSeed,
      //     nonce,
      //     boxId: currentBoxConfig.boxId,
      //     items: currentBoxConfig.items, // Send current items to API
      //   }),
      // });

      // const result = await response.json();
      const simulateApiCallAndReturnWinningItem = async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const randomItem =
              currentBoxConfig.items[
                Math.floor(Math.random() * currentBoxConfig.items.length)
              ];

            resolve({
              winningItem: randomItem,
              serverSeedHash: "simulatedServerSeedHash123456",
              verification: {
                serverSeed: "simulatedServerSeed123456",
                clientSeed,
                hash: "simulatedHash123456",
                normalized: Math.random(),
                nonce,
              },
              success: true,
            });
          }, 2000);
        });
      };
      // Simulate server seed and hash
      const result = await simulateApiCallAndReturnWinningItem();
      console.log("📡 Received spin result from API:", result);

      setSpinResult(result);
      setServerSeedHash(result.serverSeedHash);
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
        if (!item.id || !item.name || !item.value || !item.odds) {
          alert(
            `Invalid item at index ${i}: id, name, value, and odds are required.`
          );
          return;
        }
      }

      // Validate odds sum to approximately 1
      const totalOdds = newConfig.items.reduce(
        (sum, item) => sum + item.odds,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm text-purple-300">
            Items: {currentBoxConfig.items.length} | Total Odds:{" "}
            {currentBoxConfig.items
              .reduce((sum, item) => sum + item.odds, 0)
              .toFixed(3)}
          </p>
        </div>

        {/* Game Area */}
        <div className={`w-full relative`}>
          {/* Game Area - Full Width Always */}
          <div className="w-full relative">
            {/* Sidebar Toggle Button */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="absolute top-4 left-4 z-40 text-white hover:bg-white/10 bg-black/20 backdrop-blur-sm rounded-full p-3"
            >
              <ChevronRight className="h-5 w-5" />
            </Button> */}

            <SpinningWheel
              items={currentBoxConfig.items} // Use current dynamic config
              onSpinComplete={handleSpinComplete}
              onSpin={handleSpin}
              isSpinning={gameState === "spinning"}
              winningItem={spinResult?.winningItem}
              boxPrice={currentBoxConfig.boxPrice}
            />
          </div>

          {/* Left Sidebar - Overlay */}
          {/* <div
            className={`fixed left-0 top-0 h-full z-50 transition-transform duration-300 ${
              sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="w-80 h-full bg-black/90 backdrop-blur-md border-r border-white/20 shadow-2xl">
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-lg font-bold">
                    Box Configuration
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(true)}
                    className="text-white hover:bg-white/10 p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2 mb-4">
                  <Button
                    variant={!isEditingBox ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditingBox(false)}
                    className="flex-1"
                  >
                    View Items
                  </Button>
                  <Button
                    variant={isEditingBox ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditingBox(true)}
                    className="flex-1"
                  >
                    Edit JSON
                  </Button>
                </div>

                <div className="flex-1 overflow-hidden">
                  {!isEditingBox ? (
                    <div className="space-y-3 overflow-y-auto h-full">
                      {currentBoxConfig.items.map((item, index) => (
                        <div
                          key={item.id + index}
                          className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center space-x-3"
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm">
                              {item.name}
                            </h3>
                            <p className="text-green-400 font-bold">
                              ${item.value}
                            </p>
                            <p className="text-purple-300 text-xs">
                              {(item.odds * 100).toFixed(1)}% chance
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="mb-2 text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded border border-yellow-400/20">
                        💡 Tip: Make sure odds sum to 1.0 and all items have id,
                        name, value, and odds fields.
                      </div>
                      <textarea
                        value={editableBoxConfig}
                        onChange={(e) => setEditableBoxConfig(e.target.value)}
                        className="flex-1 bg-black/50 text-white font-mono text-xs p-3 rounded border border-white/20 resize-none"
                        placeholder="Edit box configuration JSON..."
                      />
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={handleBoxConfigUpdate}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          Apply Changes
                        </Button>
                        <Button
                          onClick={resetBoxConfig}
                          variant="outline"
                          size="sm"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Provably Fair Info */}
        {/* <div className="mt-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                🔒 Provably Fair System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white space-y-3">
              <div
                className={`grid gap-4 ${
                  sidebarCollapsed ? "md:grid-cols-4" : "md:grid-cols-3"
                }`}
              >
                <div>
                  <strong className="text-purple-300">Client Seed:</strong>
                  <div className="font-mono text-sm bg-white/5 p-2 rounded mt-1 break-all">
                    {clientSeed}
                  </div>
                </div>
                <div>
                  <strong className="text-purple-300">Nonce:</strong>
                  <div className="font-mono text-sm bg-white/5 p-2 rounded mt-1">
                    {nonce}
                  </div>
                </div>
                {serverSeedHash && (
                  <div>
                    <strong className="text-purple-300">
                      Server Seed Hash:
                    </strong>
                    <div className="font-mono text-xs bg-white/5 p-2 rounded mt-1 break-all">
                      {serverSeedHash}
                    </div>
                  </div>
                )}
                {sidebarCollapsed && spinResult && (
                  <div>
                    <strong className="text-purple-300">Last Winner:</strong>
                    <div className="text-sm bg-white/5 p-2 rounded mt-1">
                      {spinResult.winningItem?.name}
                    </div>
                  </div>
                )}
              </div>

              {spinResult && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-bold text-green-400 mb-2">
                    Latest Spin Verification:
                  </h4>
                  <div
                    className={`grid gap-4 text-sm ${
                      sidebarCollapsed ? "md:grid-cols-3" : "md:grid-cols-2"
                    }`}
                  >
                    <div>
                      <strong>Server Seed:</strong>
                      <div className="font-mono text-xs bg-white/5 p-2 rounded mt-1 break-all">
                        {spinResult.verification.serverSeed}
                      </div>
                    </div>
                    <div>
                      <strong>Result Hash:</strong>
                      <div className="font-mono text-xs bg-white/5 p-2 rounded mt-1 break-all">
                        {spinResult.verification.hash}
                      </div>
                    </div>
                    {sidebarCollapsed && (
                      <div>
                        <strong>Normalized Value:</strong>
                        <div className="font-mono text-xs bg-white/5 p-2 rounded mt-1">
                          {spinResult.verification.normalized?.toFixed(6)}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    You can verify this result independently using our
                    verification tool.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
