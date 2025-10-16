"use client";

import { useState, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { AlertCircle } from "lucide-react";

export default function TurnstileWidget({
  siteKey,
  onTokenChange = () => {},
  theme = "light",
  className = "",
  loading = true,
  setLoading = () => {},
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const effectiveSiteKey =
    siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    setMounted(true);

    if (!effectiveSiteKey) {
      console.error("❌ NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set!");
      setError("Security verification unavailable: Missing site key");
      setLoading(false);
      return;
    }

    console.log(
      "Turnstile site key found:",
      effectiveSiteKey.substring(0, 10) + "..."
    );
  }, [effectiveSiteKey, setLoading]);

  const handleSuccess = (tokenValue) => {
    console.log("✅ Turnstile token received");
    setToken(tokenValue);
    setLoading(false);
    setError("");
    onTokenChange(tokenValue);
  };

  const handleError = () => {
    console.error("⚠️ Turnstile verification failed");
    setError("Verification failed. Please refresh the page.");
    setLoading(false);
    onTokenChange("");
  };

  const handleExpire = () => {
    console.log("⏰ Turnstile token expired");
    setToken("");
    setLoading(true);
    setError("");
    onTokenChange("");
  };

  const handleLoad = () => {
    console.log("Turnstile widget loaded");
  };

  const handleRetry = () => {
    console.log("Manual retry requested");
    setError("");
    setLoading(true);
    setToken("");
    setMounted(false);
    setTimeout(() => setMounted(true), 100);
  };

  if (!mounted) {
    return (
      <div className={`relative w-full min-h-[65px] ${className}`}>
        <div className="w-full h-[65px] bg-gray-50 rounded-lg border border-gray-200 animate-pulse flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#11F2EB] rounded-full animate-spin"></div>
            <span className="text-sm">Initializing security check...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full min-h-[65px] ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-50/95 to-white/95 backdrop-blur-sm rounded-lg z-10">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#11F2EB] rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Verifying...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 rounded-xl z-20 p-4">
          <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
          <p className="text-sm text-red-600 text-center mb-3">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-[#11F2EB] text-white text-sm rounded-lg hover:bg-[#0DD4C7] transition-colors"
          >
            Retry Security Check
          </button>
        </div>
      )}

      {effectiveSiteKey && (
        <div className="w-full [&>div]:w-full [&_iframe]:w-full">
          <Turnstile
            siteKey={effectiveSiteKey}
            onSuccess={handleSuccess}
            onError={handleError}
            onExpire={handleExpire}
            onLoad={handleLoad}
            options={{
              theme: theme,
              size: "flexible",
            }}
          />
        </div>
      )}
    </div>
  );
}
