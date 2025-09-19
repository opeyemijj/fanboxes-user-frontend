"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { useDispatch } from "react-redux";
import {
  Hexagon,
  Target,
  Key,
  Hash,
  Clock,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Loader,
  X,
  RefreshCw,
  Crown,
  Coins,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./GameDialogues";
import ClientSeedModal from "./ClientSeedModal";
import { resellSpinForCredits } from "@/services/boxes";
import { toastError, toastSuccess } from "@/lib/toast";
import { updateUserAvailableBalance } from "@/redux/slices/user";

/* -------------  GoldenRibbon  ------------- */
const GoldenRibbon = ({ delay = 0, duration = 4, uniqueKey }) => {
  /* random starting position inside the central 50 % of the container */
  const startLeft = 25 + Math.random() * 50; // 25 % – 75 %

  const ribbonVariants = {
    initial: {
      y: -80, // slightly above viewport
      x: 0,
      left: `${startLeft}%`,
      rotate: Math.random() * 360,
      opacity: 0, // Start fully transparent
    },
    animate: {
      y: 600, // fall through the whole card
      x: (Math.random() - 0.5) * 120, // small drift
      rotate: Math.random() * 720 + 360,
      opacity: [0, 1, 1, 0.8, 0], // Smooth fade in, stay visible, then gradual fade out
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Smooth ease-in-out
        opacity: {
          duration,
          times: [0, 0.1, 0.7, 0.9, 1], // Gradual fade in/out
          ease: "easeInOut",
        },
      },
    },
  };

  const ribbonStyle = {
    position: "absolute",
    width: Math.random() * 6 + 3, // 5-11px width
    height: Math.random() * 14 + 10,
    background: `linear-gradient(45deg,#FFD700,#FFA500,#FFFF00,#FFD700,#DAA520)`,
    borderRadius: "2px",
    boxShadow: "0 0 4px rgba(255,215,0,0.7)",
  };

  return (
    <motion.div
      key={uniqueKey}
      className="pointer-events-none"
      style={ribbonStyle}
      variants={ribbonVariants}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0 }} // Smooth exit animation
    />
  );
};

/* -------------  GoldenConfetti  ------------- */
const GoldenConfetti = ({ isActive }) => {
  const [ribbons, setRibbons] = useState([]);
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setIsStopping(true);
      // Let existing ribbons finish their animation naturally
      const timer = setTimeout(() => {
        setRibbons([]);
        setIsStopping(false);
      }, 5000); // Wait for all ribbons to finish animating
      return () => clearTimeout(timer);
    }

    setIsStopping(false);

    const createRibbons = () => {
      const newRibbons = [];
      for (let i = 0; i < 20; i++) {
        newRibbons.push({
          id: `ribbon-${Date.now()}-${i}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          delay: Math.random() * 2,
          duration: Math.random() * 1 + 3.5,
        });
      }
      setRibbons(newRibbons);
    };

    createRibbons();

    const interval = setInterval(() => {
      if (!isActive || isStopping) return;

      const additional = Array.from({ length: 10 }, (_, i) => ({
        id: `ribbon-${Date.now()}-${i}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        delay: Math.random() * 1.2,
        duration: Math.random() * 1 + 3.5,
      }));
      setRibbons((prev) => {
        // Keep only the most recent ribbons to prevent memory issues
        const recentRibbons = prev.slice(-30);
        return [...recentRibbons, ...additional];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, isStopping]);

  if (!isActive && ribbons.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <AnimatePresence>
        {ribbons.map((r) => (
          <GoldenRibbon
            key={r.id}
            uniqueKey={r.id}
            delay={r.delay}
            duration={r.duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function SpinningWheel({
  items,
  onSpinComplete,
  isSpinning,
  winningItem,
  onSpin,
  boxPrice,
  isWaitingForResult,
  createSpinApiError,
  setCreateSpinApiError,
  generateAndSetClientSeed,
  clientSeed,
  resellRule,
  cashToCreditConvRate,
}) {
  const [showModal, setShowModal] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showServerSeed, setShowServerSeed] = useState(false);
  const [showClientSeedModal, setShowClientSeedModal] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [spinResultData, setSpinResultData] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(500);
  const [itemSize, setItemSize] = useState(160);
  const [showWinningItem, setShowWinningItem] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const spinnerRef = useRef(null);
  const winnerIndexRef = useRef(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const startRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const [spinRecordId, setSpinRecordId] = useState(null);
  const [showResellModal, setShowResellModal] = useState(false);
  const [resellLoading, setResellLoading] = useState(false);
  const dispatch = useDispatch();

  // Extract seed data from spinResultData
  // const clientSeed = spinResultData?.clientSeed || "";
  const serverSeed = spinResultData?.serverSeed || "";
  const serverSeedHash = spinResultData?.serverSeedHash || "";
  const nonce = spinResultData?.nonce || 0;
  const createdAt = spinResultData?.createdAt || "";
  const hash = spinResultData?.hash || "";

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

  // Auto-stop confetti after 5 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Stop after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

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
    // console.log(`   📍 Winner position: ${normalizedPosition.toFixed(6)}°`);
    console.log(`   🎯 Target (winning spot): ${WINNING_SPOT_ANGLE}°`);
    console.log(
      `   📏 Distance from target: ${distanceFromWinningSpot.toFixed(6)}°`
    );
    // console.log(`   ✅ At winning spot: ${distanceFromWinningSpot < 1}`);

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
            setShowConfetti(true); // Start confetti when modal opens
          }, 500);
        }, 300);
      } else {
        // console.error("❌ ERROR: Winner is not at the winning spot!");
        // console.log("🔧 Attempting to force correct position...");

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
              setShowConfetti(true); // Start confetti when modal opens
            }, 500);
          }, 300);
        }
      }
    }
  };

  const handleSpinClick = async () => {
    // Show seed verification modal
    // setShowSeedModal(true);

    // Call onSpin with true to get the spin result data
    const result = await onSpin(true);

    if (result) onSpin(false, result); //spin directly
    // if (result && result._id) {
    //   setSpinRecordId(result._id);
    // }
    setSpinResultData(result);
  };

  const handleContinueToSpin = () => {
    // Close seed modal and start the actual spin with the result data
    setShowSeedModal(false);
    setCreateSpinApiError(null); // Clear any previous errors
    onSpin(false, spinResultData);
  };

  // Function to delete spin record (to be implemented)
  const deleteSpinRecord = async (spinId) => {
    console.log("Deleting spin record with ID:", spinId);
    // TODO: Implement API call to delete spin record
    // Example:
    // try {
    //   const response = await fetch(`/api/spins/${spinId}`, {
    //     method: 'DELETE',
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to delete spin record');
    //   }
    //   console.log('Spin record deleted successfully');
    // } catch (error) {
    //   console.error('Error deleting spin record:', error);
    // }
  };

  const handleCancelSpin = () => {
    if (isWaitingForResult) return;
    // Close the modal
    setShowSeedModal(false);

    // If we have a spin record ID, delete the spin record
    if (spinRecordId) {
      deleteSpinRecord(spinRecordId);
    }

    // Clear any error messages
    setCreateSpinApiError(null);
  };

  const handleRegenerateClientSeed = () => {
    generateAndSetClientSeed();
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle modal close with page refresh
  const handleModalClose = () => {
    setShowConfetti(false); // Stop confetti when modal closes
    setShowModal(false);
    // Refresh the page after modal closes
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  useEffect(() => {
    if (isSpinning && winningItem) {
      console.log("🎡 STARTING PRECISE SPIN CALCULATION");
      // console.log("🔐 Backend determined winner:", {
      //   id: winningItem.id,
      //   name: winningItem.name,
      //   value: winningItem.value,
      // });

      winnerIndexRef.current = items.findIndex(
        (item) => item._id === winningItem._id
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
      // console.log(`   🎯 Winning spot: ${WINNING_SPOT_ANGLE}° (center front)`);
      // console.log(`   🏆 Winner index: ${winnerIndexRef.current}`);

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
      // console.log(
      //   `   🎯 Winner will land at: ${WINNING_SPOT_ANGLE}° (absolute center front)`
      // );

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

  // Helper function to calculate resell amount
  const calculateResellAmount = (originalValue, resellRule) => {
    if (!resellRule) return originalValue * 0.8; // Fallback to 80%

    if (resellRule.valueType === "percentage") {
      return originalValue * (resellRule.value / 100);
    } else {
      return resellRule.value || 0;
    }
  };

  // Helper function to get resell display text
  const getResellDisplayText = (originalValue, resellRule) => {
    if (!resellRule) return `Based on 80% resell value of $${originalValue}`;

    if (resellRule.valueType === "percentage") {
      return `Based on ${resellRule.value}% resell value of $${originalValue}`;
    } else {
      return `Fixed resell price of $${resellRule.value || 0}`;
    }
  };

  async function handleClaimTokenFromSpinReward() {
    try {
      setResellLoading(true);
      // console.log({ spinResultData, spinRecordId });
      const res = await resellSpinForCredits({ spinId: spinResultData._id });
      console.log({ res });
      if (res?.success) {
        toastSuccess("You have been credited successully");
        // update balance in redux
        dispatch(
          updateUserAvailableBalance(res?.data?.transaction.availableBalance)
        );
      } else {
        toastError(
          "An unexpected error occurred, and no credits have been deducted yet. Please try again later"
        );
      }

      setResellLoading(false);
      setShowResellModal(false);
      handleModalClose();
    } catch (error) {
      console.log("EEE::", error);
      setResellLoading(false);
      setShowResellModal(false);
      toastError(
        `${error.response?.data?.message}. No credits have been deducted from your account yet` ||
          "An unexpected error occurred, and no credits have been deducted yet. Please try again later"
      );
    }
  }

  return (
    <>
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden flex flex-col items-center justify-center rounded-2xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />

        {/* Client Seed Regenerate Button - Top Right */}
        <div className="absolute top-4 right-4 z-50">
          <div className="relative group">
            <button
              onClick={() => setShowClientSeedModal(true)}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              title="View and regenerate client seed"
            >
              <RefreshCw className="w-5 h-5 text-cyan-600" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-40 p-2 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              View and regenerate client seed
            </div>
          </div>
        </div>

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
            {/* Pointer arrow */}
            {isSpinning && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#11F2EB]" />
            )}
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
                          ? "border-4 border-[#11F2EB] shadow-[#11F2EB]/70 bg-gradient-to-br from-[#11F2EB]/30 to-orange-100/30"
                          : style.isAtWinningSpot && !isSpinning
                          ? "border-2 border-[#11F2EB]/50"
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
                          className="absolute -top-3 -right-3 w-12 h-12 bg-[#11F2EB] rounded-full flex items-center justify-center text-black font-bold text-xl shadow-lg z-10"
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
                          className="absolute inset-0 bg-gradient-to-br from-[#11F2EB]-400/40 to-[#11F2EB]-400/40 rounded-2xl"
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
    bg-gradient-to-r from-[#11F2EB] via-cyan-500 to-cyan-600 
    hover:from-cyan-400 hover:via-[#11F2EB] hover:to-blue-700
    text-white font-bold text-lg 

    transition-all hover:scale-105 active:scale-95 
    disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSpinClick}
            disabled={isSpinning || isWaitingForResult || items?.length < 1}
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
            ) : isWaitingForResult ? (
              <div className="flex items-center">
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                LOADING...
              </div>
            ) : (
              <div className="flex items-center">
                SPIN FOR
                <Hexagon className="h-5 w-5 mx-2" />${boxPrice}
              </div>
            )}
          </Button>
        </div>
      </div>

      {/*Client Seed Modal & Seed Verification Modal */}
      {/* <ClientSeedModal
        onSpin={onSpin}
        isWaitingForResult={isWaitingForResult}
        createSpinApiError={createSpinApiError}
        setCreateSpinApiError={setCreateSpinApiError}
        generateAndSetClientSeed={generateAndSetClientSeed}
        showSeedModal={showSeedModal}
        setShowSeedModal={setShowSeedModal}
        spinResultData={spinResultData}
        setSpinResultData={setSpinResultData}
        setCopiedField={setCopiedField}
        copiedField={copiedField}
        spinRecordId={spinRecordId}
        //client seed regeneration modal
        handleRegenerateClientSeed={handleRegenerateClientSeed}
        setShowClientSeedModal={setShowClientSeedModal}
        showClientSeedModal={showClientSeedModal}
        clientSeed={clientSeed}
      /> */}

      {/* Winner Modal - HIGH Z-INDEX with Golden Confetti */}
      <AnimatePresence>
        {showModal && winningItem && !isSpinning && (
          <Dialog open={showModal} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[500px] max-w-[95vw] bg-gradient-to-br from-cyan-50 to-blue-50 z-[9999] fixed p-0 overflow-hidden rounded-2xl">
              {/* Golden Confetti Animation */}
              <GoldenConfetti isActive={showConfetti} />

              {/* Close Button */}
              <button
                onClick={handleModalClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors z-20 shadow-sm"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex flex-col items-center pt-6 pb-4 px-6 relative z-10">
                <DialogHeader className="mb-3">
                  <DialogTitle className="text-2xl font-bold text-center text-gray-800">
                    You've won!
                  </DialogTitle>
                </DialogHeader>

                {/* Item Display */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative mb-4"
                >
                  <img
                    src={winningItem.images[0]?.url || "/placeholder.svg"}
                    alt={winningItem.name}
                    width={140}
                    height={140}
                    className="object-contain h-32 w-auto mx-auto"
                  />
                  <h3 className="text-lg font-bold text-gray-800 text-center mt-2 max-w-xs">
                    {winningItem.name}
                  </h3>
                </motion.div>

                {/* Value Display - With arrow between original buttons */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {/* Cash Value - Original Style */}
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-800 rounded-lg px-4 py-2 mb-1">
                      <span className="text-white font-semibold">
                        ${winningItem.value}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">Cash Value</span>
                  </div>

                  {/* Conversion Arrow */}
                  <div className="flex flex-col items-start mx-1 pt-5 mb-7">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="w-6 h-6 bg-transparent rounded-full flex items-start justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Credit Value with Hexagon - Original Style */}
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-800 rounded-lg px-3 py-2 mb-1 flex items-center">
                      <Hexagon
                        className="h-4 w-4 text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                      <span className="text-white font-semibold">
                        {winningItem.value}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">Credit Value</span>
                  </div>
                </div>

                {/* Conversion Rate Bar */}
                <div className="w-full max-w-sm bg-gray-200 rounded-full h-2 mb-5 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-amber-500 py-1"
                  />
                  <div className="p-0.5 absolute left-0 top-0 w-full h-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700 bg-white/80 px-2 rounded-full">
                      Conversion Rate: 1 Credit = $
                      {cashToCreditConvRate?.value || 1} USD
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  <Button
                    className="w-full h-11 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                    onClick={() => setShowResellModal(true)} // Open resell confirmation modal
                  >
                    CLAIM TOKENS
                  </Button>
                  <Button
                    className="w-full h-11 bg-gradient-to-r from-[#11F2EB] to-cyan-600 
                   hover:from-cyan-500 hover:to-[#11F2EB] text-slate-800 font-medium rounded-lg shadow-sm"
                    onClick={handleModalClose}
                  >
                    SHIP ITEM →
                  </Button>
                </div>
              </div>

              {/* Verification link */}
              {spinResultData && (
                <div className="px-6 pb-3 pt-2 border-t border-gray-200 relative z-10">
                  <button
                    onClick={() => {
                      const queryParams = new URLSearchParams({
                        clientSeed: spinResultData?.clientSeed || "",
                        serverSeed: spinResultData?.serverSeed || "",
                        serverSeedHash: spinResultData?.serverSeedHash || "",
                        nonce: spinResultData?.nonce || "",
                        hash: spinResultData?.hash || "",
                        createdAt: spinResultData?.createdAt || "",
                        normalized: spinResultData?.normalized || "",
                        boxSlug: spinResultData?.boxDetails?.slug || "",
                      }).toString();

                      window.open(`/verify-spin?${queryParams}`, "_blank");
                    }}
                    className="text-xs text-gray-500 hover:text-cyan-600 transition-colors duration-200 flex items-center justify-center w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Verify spin integrity
                  </button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Resell Confirmation Modal */}
        {showResellModal && winningItem && !isSpinning && (
          <Dialog open={showResellModal} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[500px] max-w-[95vw] bg-white z-[10000] fixed p-0 overflow-hidden rounded-2xl shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="px-6 py-16">
                {/* Close Button - Disabled during loading */}
                <button
                  onClick={() => !resellLoading && setShowResellModal(false)}
                  disabled={resellLoading}
                  className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full ${
                    resellLoading
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-white/80 hover:bg-white"
                  } transition-colors z-20 shadow-sm`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      resellLoading ? "text-gray-400" : "text-gray-700"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold text-center text-gray-800">
                    Confirm Token Claim
                  </DialogTitle>
                  <DialogDescription className="text-center text-gray-600">
                    Review the conversion details before proceeding
                  </DialogDescription>
                </DialogHeader>

                {/* Calculate values based on resellRule and conversion rate */}
                {(() => {
                  const originalValue = winningItem.value;
                  const conversionRate = cashToCreditConvRate?.value || 1;
                  const finalAmount = calculateResellAmount(
                    originalValue,
                    resellRule
                  );
                  const creditsAmount = finalAmount / conversionRate;
                  const displayText = getResellDisplayText(
                    originalValue,
                    resellRule
                  );

                  return (
                    <>
                      {/* Conversion Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-5">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">
                              Original Value
                            </div>
                            <div className="text-lg font-bold text-gray-800">
                              ${originalValue}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-1">
                              {resellRule?.valueType === "percentage"
                                ? "Resell Rate"
                                : "Fixed Price"}
                            </div>
                            <div className="text-lg font-bold text-amber-600">
                              {resellRule?.valueType === "percentage"
                                ? `${resellRule.value}%`
                                : `$${resellRule?.value}`}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">
                              You will receive:
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              ${finalAmount.toFixed(0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">
                              Credits equivalent:
                            </span>
                            <span className="text-lg font-bold text-gray-800 flex items-center">
                              <Hexagon
                                className="h-4 w-4 ml-1.5 text-[#FFD700]"
                                fill="#FFD700"
                              />
                              {creditsAmount.toFixed(0).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {displayText} • 1 Credit = ${conversionRate} USD
                          </div>
                        </div>
                      </div>

                      {/* Warning Message */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-5">
                        <div className="flex items-start">
                          <svg
                            className="w-5 h-5 text-yellow-500 mr-2 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <span className="text-sm text-yellow-700">
                            This action cannot be undone. The item will be
                            converted to tokens at the current resell rate.
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          className="w-full h-11 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                          onClick={() => setShowResellModal(false)}
                          disabled={resellLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="w-full h-11 bg-gradient-to-r from-[#11F2EB] to-cyan-600 
                         hover:from-cyan-500 hover:to-[#11F2EB] text-slate-800 font-medium rounded-lg shadow-sm flex items-center justify-center"
                          onClick={() => {
                            handleClaimTokenFromSpinReward();
                          }}
                          disabled={resellLoading}
                        >
                          {resellLoading ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Confirm Claim"
                          )}
                        </Button>
                      </div>

                      {/* Loading Overlay */}
                      {resellLoading && (
                        <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                          <div className="text-center">
                            <Loader className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-2" />
                            <p className="text-gray-700 font-medium">
                              Processing your claim...
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Please wait while we process your tokens
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
