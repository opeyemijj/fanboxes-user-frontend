// contexts/GameContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { initializeSpin } from "../services/boxes/spin-game/index";
import { toastError } from "@/lib/toast";

const GameContext = createContext();

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children, box }) => {
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();

  // Game States
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState("idle"); // idle, spinning, completed, waiting
  const [spinResult, setSpinResult] = useState(null);
  const [serverSeedHash, setServerSeedHash] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState(1);
  const [createSpinApiError, setCreateSpinApiError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isEditingBox, setIsEditingBox] = useState(false);

  // Make box config dynamic and editable
  const [currentBoxConfig, setCurrentBoxConfig] = useState(box);
  const [editableBoxConfig, setEditableBoxConfig] = useState(
    JSON.stringify(box, null, 2)
  );

  useEffect(() => {
    setMounted(true);
    generateAndSetClientSeed();
  }, []);

  useEffect(() => {
    setCurrentBoxConfig(box);
    setEditableBoxConfig(JSON.stringify(box, null, 2));
  }, [box]);

  function generateAndSetClientSeed() {
    const initialClientSeed = Math.random().toString(36).substring(2, 15);
    console.log("🎮 Game initialized with client seed:", initialClientSeed);
    setClientSeed(initialClientSeed);
  }

  const handleSpin = async (resultsOnly = true, reusableResult) => {
    console.log("🚀 Starting spin process...");
    console.log("📦 Using current box config:", currentBoxConfig);

    try {
      const token = user?.user?.token;
      if (!token) {
        toastError("Please log in to spin the wheel.");
        router.push(`/login?dest=${pathname}`);
        return;
      }

      setGameState("waiting");

      if (resultsOnly) {
        // Call the spin API with current box configuration
        const result = await initializeSpin({
          clientSeed,
          nonce,
          boxId: currentBoxConfig._id,
          items: currentBoxConfig.items,
        });

        console.log("📡 Received spin result from API:", result);

        if (!result?.success) {
          setGameState("idle");
          setCreateSpinApiError(result?.message);
          toastError(result?.message);
          return null;
        }

        console.log("result.data", result.data);
        setGameState("idle");
        return result?.data;
      }

      setGameState("spinning");
      setSpinResult(reusableResult);
      setServerSeedHash(reusableResult?.serverSeedHash);
      setNonce((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error during spin:", error);
      setGameState("idle");
      setCreateSpinApiError(
        error?.response?.data?.message ||
          error?.message ||
          "Internal server error"
      );
      toastError(
        error?.response?.data?.message ||
          error?.message ||
          "Internal server error"
      );
    }
  };

  const handleSpinComplete = () => {
    console.log("🎊 Spin animation completed");
    setGameState("completed");
  };

  const resetGame = () => {
    setGameState("idle");
    setSpinResult(null);
    setCreateSpinApiError("");
  };

  const contextValue = {
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
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
