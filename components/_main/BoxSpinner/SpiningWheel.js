"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { Hexagon, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./GameDialogues";

export default function SpinningWheel({
  items,
  onSpinComplete,
  isSpinning,
  winningItem,
  onSpin,
  boxPrice,
}) {
  const [showModal, setShowModal] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(500);
  const [itemSize, setItemSize] = useState(160);
  const [showWinningItem, setShowWinningItem] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const spinnerRef = useRef(null);
  const winnerIndexRef = useRef(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const startRotationRef = useRef(0);
  const targetRotationRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRadius(250);
        setItemSize(80);
      } else if (window.innerWidth < 1280) {
        setRadius(400);
        setItemSize(120);
      } else {
        setRadius(550);
        setItemSize(160);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const numItems = items.length;
  const angleStep = 360 / numItems;

  // WINNING SPOT: Absolute center front (closest to user) = 180° in our coordinate system
  const WINNING_SPOT_ANGLE = 180;

  // Smooth deceleration function
  const smoothDeceleration = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  // Calculate exact rotation needed to position winner at the winning spot
  const calculateWinningRotation = (currentRotation, winnerIndex) => {
    console.log("🎯 CALCULATING WINNING ROTATION:");
    console.log(`   🏆 Winner: ${winningItem?.name}`);
    console.log(`   📍 Winner index: ${winnerIndex}`);
    console.log(`   🔄 Current rotation: ${currentRotation.toFixed(6)}°`);

    // Calculate where the winner sits on the wheel (its base position)
    const winnerBaseAngle = winnerIndex * angleStep;
    console.log(`   📐 Winner base angle: ${winnerBaseAngle.toFixed(6)}°`);
    console.log(`   📏 Angle step: ${angleStep.toFixed(6)}°`);

    // We want: (winnerBaseAngle + finalRotation) % 360 = WINNING_SPOT_ANGLE
    // So: finalRotation = WINNING_SPOT_ANGLE - winnerBaseAngle + (n * 360)

    // Calculate the base rotation needed (without extra spins)
    let baseRotationNeeded = WINNING_SPOT_ANGLE - winnerBaseAngle;

    // Normalize to positive value
    while (baseRotationNeeded < 0) {
      baseRotationNeeded += 360;
    }

    console.log(
      `   🎯 Base rotation needed: ${baseRotationNeeded.toFixed(6)}°`
    );

    // Add multiple full spins for dramatic effect (5-8 full rotations)
    const minFullSpins = 5;
    const maxFullSpins = 8;
    const fullSpins = Math.floor(
      minFullSpins + Math.random() * (maxFullSpins - minFullSpins)
    );
    const totalSpinRotation = fullSpins * 360;

    // Calculate final target rotation
    const finalRotation =
      currentRotation + totalSpinRotation + baseRotationNeeded;

    console.log(`   🌀 Full spins added: ${fullSpins} (${totalSpinRotation}°)`);
    console.log(`   🏁 Final target rotation: ${finalRotation.toFixed(6)}°`);

    // Verify our calculation
    const finalWinnerPosition = (winnerBaseAngle + finalRotation) % 360;
    console.log(
      `   🔍 Verification: Winner will be at ${finalWinnerPosition.toFixed(
        6
      )}° (should be ${WINNING_SPOT_ANGLE}°)`
    );
    console.log(
      `   ✅ Calculation correct: ${
        Math.abs(finalWinnerPosition - WINNING_SPOT_ANGLE) < 0.001
      }`
    );

    return finalRotation;
  };

  // Verify winner is at the winning spot with high precision
  const verifyWinnerPosition = (currentRotation, winnerIndex) => {
    const winnerBaseAngle = winnerIndex * angleStep;
    const winnerCurrentPosition = (winnerBaseAngle + currentRotation) % 360;
    const normalizedPosition = ((winnerCurrentPosition % 360) + 360) % 360;

    const distanceFromWinningSpot = Math.min(
      Math.abs(normalizedPosition - WINNING_SPOT_ANGLE),
      Math.abs(normalizedPosition - WINNING_SPOT_ANGLE + 360),
      Math.abs(normalizedPosition - WINNING_SPOT_ANGLE - 360)
    );

    console.log("🔍 WINNER POSITION VERIFICATION:");
    console.log(`   📐 Winner base angle: ${winnerBaseAngle.toFixed(6)}°`);
    console.log(`   🔄 Current rotation: ${currentRotation.toFixed(6)}°`);
    console.log(`   📍 Winner position: ${normalizedPosition.toFixed(6)}°`);
    console.log(`   🎯 Target (winning spot): ${WINNING_SPOT_ANGLE}°`);
    console.log(
      `   📏 Distance from target: ${distanceFromWinningSpot.toFixed(6)}°`
    );
    console.log(`   ✅ At winning spot: ${distanceFromWinningSpot < 1}`);

    return distanceFromWinningSpot < 1; // Allow 1 degree tolerance
  };

  // Animation function
  const animateWheel = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const spinDuration = 5000; // 5 seconds
    const progress = Math.min(elapsed / spinDuration, 1);

    // Apply smooth deceleration
    const easedProgress = smoothDeceleration(progress);

    // Calculate current rotation
    const totalRotation = targetRotationRef.current - startRotationRef.current;
    const currentRotation =
      startRotationRef.current + totalRotation * easedProgress;

    // Calculate current speed for visual feedback
    const remainingRotation = targetRotationRef.current - currentRotation;
    const remainingTime = (spinDuration - elapsed) / 1000;
    const speed =
      remainingTime > 0 ? Math.max(0, remainingRotation / remainingTime) : 0;

    setCurrentSpeed(speed);
    setRotation(currentRotation);

    if (progress < 1) {
      // Still spinning
      animationRef.current = requestAnimationFrame(animateWheel);
    } else {
      // Spin complete - set exact final position
      const exactFinalRotation = targetRotationRef.current;
      setRotation(exactFinalRotation);
      setCurrentSpeed(0);

      console.log("🏁 SPIN COMPLETED!");
      console.log(
        `   🎯 Final rotation set to: ${exactFinalRotation.toFixed(6)}°`
      );

      // Verify the winner is at the winning spot
      if (verifyWinnerPosition(exactFinalRotation, winnerIndexRef.current)) {
        console.log("🎯 SUCCESS: Winner is at the winning spot!");
        setShowWinningItem(true);

        setTimeout(() => {
          onSpinComplete();
          setTimeout(() => {
            setShowModal(true);
          }, 500);
        }, 300);
      } else {
        console.error("❌ ERROR: Winner is not at the winning spot!");
        console.log("🔧 Attempting to force correct position...");

        // Force the exact position as a fallback
        const winnerBaseAngle = winnerIndexRef.current * angleStep;
        const correctedRotation =
          exactFinalRotation +
          (WINNING_SPOT_ANGLE - ((winnerBaseAngle + exactFinalRotation) % 360));

        console.log(
          `   🔧 Corrected rotation: ${correctedRotation.toFixed(6)}°`
        );
        setRotation(correctedRotation);

        // Verify correction
        if (verifyWinnerPosition(correctedRotation, winnerIndexRef.current)) {
          console.log("✅ CORRECTION SUCCESSFUL!");
          setShowWinningItem(true);
          setTimeout(() => {
            onSpinComplete();
            setTimeout(() => {
              setShowModal(true);
            }, 500);
          }, 300);
        }
      }
    }
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setShowWinningItem(false);
    setShowModal(false);
    onSpin();
  };

  // Handle modal close with page refresh
  const handleModalClose = () => {
    setShowModal(false);
    // Refresh the page after modal closes
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  useEffect(() => {
    if (isSpinning && winningItem) {
      console.log("🎡 STARTING PRECISE SPIN CALCULATION");
      console.log("🔐 Backend determined winner:", {
        id: winningItem.id,
        name: winningItem.name,
        value: winningItem.value,
      });

      winnerIndexRef.current = items.findIndex(
        (item) => item.id === winningItem.id
      );

      if (winnerIndexRef.current === -1) {
        console.error(
          "❌ CRITICAL ERROR: Winner item not found in items array!"
        );
        return;
      }

      console.log("📊 WHEEL SETUP:");
      console.log(`   🎲 Total items: ${items.length}`);
      console.log(`   📏 Angle per item: ${angleStep.toFixed(6)}°`);
      console.log(`   🎯 Winning spot: ${WINNING_SPOT_ANGLE}° (center front)`);
      console.log(`   🏆 Winner index: ${winnerIndexRef.current}`);

      // Calculate exact rotation needed
      const targetRotation = calculateWinningRotation(
        rotation,
        winnerIndexRef.current
      );

      // Set up animation parameters
      startRotationRef.current = rotation;
      targetRotationRef.current = targetRotation;
      startTimeRef.current = 0;

      console.log("🚀 STARTING ANIMATION");
      console.log(
        `   📊 From: ${rotation.toFixed(6)}° to ${targetRotation.toFixed(6)}°`
      );
      console.log(
        `   🎯 Winner will land at: ${WINNING_SPOT_ANGLE}° (absolute center front)`
      );

      // Start animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animateWheel);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, winningItem, items, angleStep]);

  // Get item position and styling
  const getItemStyle = (itemIndex, currentRotation) => {
    const itemAngle = itemIndex * angleStep;
    const currentAngle = (itemAngle + currentRotation) % 360;
    const normalizedAngle = ((currentAngle % 360) + 360) % 360;

    // Convert to radians for positioning
    const radians = (normalizedAngle * Math.PI) / 180;

    // 3D circular positions - 180° = center front (closest to user)
    const x = Math.sin(radians) * radius;
    const z = -Math.cos(radians) * radius;

    // Check if this item is at the winning spot (180°)
    const distanceFromWinningSpot = Math.min(
      Math.abs(normalizedAngle - WINNING_SPOT_ANGLE),
      Math.abs(normalizedAngle - WINNING_SPOT_ANGLE + 360),
      Math.abs(normalizedAngle - WINNING_SPOT_ANGLE - 360)
    );
    const isAtWinningSpot = distanceFromWinningSpot < 15;

    // Scale and effects based on depth
    const depthFactor = (z + radius) / (2 * radius);
    const scale = 0.6 + 0.4 * depthFactor;
    const opacity = 0.7 + 0.3 * depthFactor;
    const blur = (1 - depthFactor) * 2;

    // Check if this is the winning item and should be highlighted
    const isWinningItemAtWinningSpot =
      !isSpinning &&
      showWinningItem &&
      itemIndex === winnerIndexRef.current &&
      isAtWinningSpot;

    return {
      x,
      z,
      scale,
      opacity,
      blur,
      isAtWinningSpot,
      isWinningItemAtWinningSpot,
      zIndex: Math.round(z + radius),
      normalizedAngle,
    };
  };

  return (
    <>
      <div className="relative w-full h-[85vh] min-h-[600px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden flex flex-col items-center justify-center rounded-2xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />

        {/* Speed Indicator */}
        {isSpinning && (
          <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="text-white text-sm font-mono">
              <div>Speed: {currentSpeed.toFixed(0)}°/s</div>
              <div className="w-32 h-2 bg-white/20 rounded-full mt-1">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-100"
                  style={{
                    width: `${Math.min(100, (currentSpeed / 1000) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* FIXED WINNING SPOT INDICATOR - Absolute Center Front */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Main pointer */}
            <div className="w-15 h-15 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/50 border-4 border-white">
              <Target className="w-10 h-10 text-black" />
            </div>

            {/* Pointer arrow */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[20px] border-l-transparent border-r-transparent border-b-cyan-400" />
          </motion.div>
        </div>

        {/* 3D WHEEL */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: radius * 2,
              height: radius * 2,
            }}
          >
            {items.map((item, index) => {
              const style = getItemStyle(index, rotation);

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    width: itemSize,
                    height: itemSize,
                    left: "50%",
                    top: "50%",
                    transform: `
                      translate(-50%, -50%) 
                      translate3d(${style.x}px, 0px, 0px)
                      scale(${style.scale})
                    `,
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                    filter: `blur(${style.blur}px)`,
                    transition: isSpinning ? "none" : "all 0.3s ease-out",
                  }}
                >
                  <div
                    className={`
                      relative w-full h-full rounded-2xl overflow-hidden
                      bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm
                      ${
                        style.z > 0
                          ? "shadow-2xl shadow-blue-500/20"
                          : "shadow-lg shadow-black/20"
                      }
                      ${
                        style.isWinningItemAtWinningSpot
                          ? "border-4 border-yellow-400 shadow-yellow-400/70 bg-gradient-to-br from-yellow-100/30 to-orange-100/30"
                          : style.isAtWinningSpot && !isSpinning
                          ? "border-2 border-yellow-300/50"
                          : "border border-white/20"
                      }
                      transition-all duration-500
                    `}
                  >
                    <img
                      src={item.images[0]?.url || "/placeholder.svg"}
                      alt={item.name}
                      width={itemSize}
                      height={itemSize}
                      className="object-contain w-full h-full p-3"
                    />
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      ${item.value}
                    </div>

                    {/* Winner effects */}
                    {style.isWinningItemAtWinningSpot && (
                      <>
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg z-10"
                        >
                          🏆
                        </motion.div>
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 rounded-2xl"
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spin Button */}
        <div className="absolute bottom-8 z-20">
          <Button
            size="lg"
            className="h-14 rounded-full 
    bg-gradient-to-r from-[#11F2EB] via-cyan-500 to-blue-600 
    hover:from-cyan-400 hover:via-[#11F2EB] hover:to-blue-700
    text-white font-bold text-lg 

    transition-all hover:scale-105 active:scale-95 
    disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {isSpinning ? (
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="flex items-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="mr-2"
                >
                  <Hexagon className="h-5 w-5" />
                </motion.div>
                SPINNING...
              </motion.span>
            ) : (
              <div className="flex items-center">
                SPIN FOR
                <Hexagon className="h-5 w-5 mx-2" />${boxPrice}
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Winner Modal - HIGH Z-INDEX */}
      <AnimatePresence>
        {showModal && winningItem && !isSpinning && (
          <Dialog open={showModal} onOpenChange={handleModalClose}>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-purple-50 to-blue-50 z-[9999] fixed">
              <DialogHeader>
                <DialogTitle className="text-3xl text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  🎉 Congratulations! 🎉
                </DialogTitle>
                <DialogDescription className="text-center text-lg text-gray-600">
                  You've won an amazing prize!
                </DialogDescription>
              </DialogHeader>
              <div className="py-6 flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30 scale-110" />
                  <div className="relative bg-white rounded-2xl p-4 shadow-2xl">
                    <img
                      src={winningItem.images[0]?.url || "/placeholder.svg"}
                      alt={winningItem.name}
                      width="200"
                      height="200"
                      className="object-contain"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-center mt-6"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {winningItem.name}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Value: ${winningItem.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Rarity: {winningItem.rarity}
                  </p>
                </motion.div>
              </div>
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 bg-transparent"
                  onClick={handleModalClose}
                >
                  💰 Sell for Credits
                </Button>
                <Button
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={handleModalClose}
                >
                  📦 Ship to Me
                </Button>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
