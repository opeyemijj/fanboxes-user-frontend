// contexts/GameContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  initializeDemoSpin,
  initializeSpin,
} from "../services/boxes/spin-game/index";
import { toastError } from "@/lib/toast";
import {
  getCashToCreditConversionRate,
  getResellPercentage,
} from "@/services/boxes";
import { updateUserAvailableBalance } from "@/redux/slices/user";

const GameContext = createContext();

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export const GameProvider = ({ children, box }) => {
  const user = useSelector((state) => state?.user || null);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Game States
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState("idle"); // idle, spinning, completed, waiting
  const [spinResult, setSpinResult] = useState(null);
  const [serverSeedHash, setServerSeedHash] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState(1);
  const [createSpinApiError, setCreateSpinApiError] = useState("");
  const [insufficientBalError, setInSufficientBalError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isEditingBox, setIsEditingBox] = useState(false);
  const [resellRule, setResellRule] = useState(null);
  const [cashToCreditConvRate, setCashTocreditConvRate] = useState(null);

  // Make box config dynamic and editable
  const [currentBoxConfig, setCurrentBoxConfig] = useState(box);
  const [editableBoxConfig, setEditableBoxConfig] = useState(
    JSON.stringify(box, null, 2)
  );

  useEffect(() => {
    setMounted(true);
    fetchCashToCreditConversionRate();
    fetchCurrentResellPercentage();
    generateAndSetClientSeed();
  }, []);

  async function fetchCashToCreditConversionRate() {
    try {
      const res = await getCashToCreditConversionRate();
      if (res?.success) {
        const { _id, value, valueType, slug } = res.data;
        setCashTocreditConvRate({ _id, value, valueType, slug });
      }
    } catch (error) {
      console.error("err fetching resell perc:", error);
    }
  }

  async function fetchCurrentResellPercentage() {
    try {
      const res = await getResellPercentage();
      if (res?.success) {
        const { _id, value, valueType, slug } = res.data;
        setResellRule({ _id, value, valueType, slug });
      }
    } catch (error) {
      console.error("err fetching resell perc:", error);
    }
  }

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
      setInSufficientBalError(false);
      setCreateSpinApiError("");

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
        //update wallet bal
        const availableBalance = result?.availableBalance;
        // dispatch(updateUserAvailableBalance(availableBalance));
        setGameState("idle");
        return { ...result?.data, availableBalance };
      }

      setGameState("spinning");
      setSpinResult(reusableResult);
      setServerSeedHash(reusableResult?.serverSeedHash);
      setNonce((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error during spin:", error);
      setGameState("idle");

      if (error?.response?.data?.errorCode === "INSUFFICIENT_BALANCE") {
        setInSufficientBalError(true);
      }
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

  const handleDemoSpin = async (resultsOnly = true, reusableResult) => {
    console.log("🚀 Starting demo spin process...");
    console.log("📦 Using current box config:", currentBoxConfig);

    try {
      const token = user?.user?.token;
      if (!token) {
        toastError("Please log in to spin the box.");
        router.push(`/login?dest=${pathname}`);
        return;
      }

      setGameState("waiting");
      setInSufficientBalError(false);
      setCreateSpinApiError("");

      if (resultsOnly) {
        // Call the spin API with current box configuration
        const result = await initializeDemoSpin({
          clientSeed,
          nonce,
          boxId: currentBoxConfig._id,
          items: currentBoxConfig.items,
        });

        console.log("📡 Received demo spin result from API:", result);

        if (!result?.success) {
          setGameState("idle");
          setCreateSpinApiError(result?.message);
          toastError(result?.message);
          return null;
        }

        console.log("demo-result.data", result.data);
        //update wallet bal
        const availableBalance = result?.availableBalance;
        // dispatch(updateUserAvailableBalance(availableBalance));
        setGameState("idle");
        return { ...result?.data, availableBalance };
      }

      setGameState("spinning");
      setSpinResult(reusableResult);
      setServerSeedHash(reusableResult?.serverSeedHash);
      setNonce((prev) => prev + 1);
    } catch (error) {
      console.error("❌ Error during demo spin:", error);
      setGameState("idle");

      // if (error?.response?.data?.errorCode === "INSUFFICIENT_BALANCE") {
      //   setInSufficientBalError(true);
      // }

      if (error?.response?.status === 401) {
        toastError("Please log in to spin the box.");
        router.push(`/login?dest=${pathname}`);
        return;
      }

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
    handleDemoSpin,
    handleSpinComplete,
    generateAndSetClientSeed,
    resetGame,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
