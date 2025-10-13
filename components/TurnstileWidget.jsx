"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Shield, AlertCircle } from "lucide-react";

export default function TurnstileWidget({
  siteKey,
  onTokenChange = () => {},
  theme = "light",
  className = "",
  loading = true,
  setLoading = () => {},
}) {
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  // Get site key from props or env
  const effectiveSiteKey =
    siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // Validate site key exists
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

    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // Load Turnstile script if not already present
    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("[v0] Turnstile script loaded successfully");
        renderTurnstile();
      };
      script.onerror = () => {
        console.error("❌ Failed to load Turnstile script.");
        setError("Failed to load security verification");
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      renderTurnstile();
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          console.warn("Turnstile cleanup warning:", e);
        }
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveSiteKey]);

  const renderTurnstile = () => {
    if (widgetIdRef.current || !turnstileRef.current || !window.turnstile)
      return;

    console.log("Rendering Turnstile widget...");

    try {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: effectiveSiteKey,
        callback: (tokenValue) => {
          console.log("✅ Turnstile token received");
          setToken(tokenValue);
          setLoading(false);
          setError("");
          onTokenChange(tokenValue);
        },
        "error-callback": (errorCode) => {
          console.error("⚠️ Turnstile verification failed:", errorCode);
          setError("Verification failed. Please refresh the page.");
          setLoading(false);
          onTokenChange("");
        },
        "expired-callback": () => {
          console.log("⏰ Turnstile token expired, resetting...");
          setToken("");
          setLoading(true);
          setError("");
          onTokenChange("");
          if (window.turnstile && widgetIdRef.current) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch (e) {
              console.warn("Reset warning:", e);
            }
          }
        },
        "timeout-callback": () => {
          console.error("⏱️ Turnstile timeout");
          setError("Verification timed out. Please try again.");
          setLoading(false);
          onTokenChange("");
        },
        theme,
        size: "flexible",
      });

      console.log("Turnstile widget rendered with ID:", widgetIdRef.current);
    } catch (err) {
      console.error("❌ Turnstile render error:", err);
      setError("Failed to initialize security check");
      setLoading(false);
    }
  };

  return (
    <div className={`relative w-full min-h-[65px] ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center bg-white bg-opacity-90 rounded-xl z-10">
          <div className="flex items-center space-x-2 text-gray-600 pl-1">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">
              Loading security check...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center text-red-600 text-sm p-3 bg-red-50 rounded-lg">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        ref={turnstileRef}
        className="w-full flex justify-center items-center [&>div]:w-full [&>iframe]:w-full"
      ></div>

      {token && !loading && !error && (
        <div className="flex items-center text-green-600 text-sm mt-2">
          <Shield className="h-4 w-4 mr-1" />
          <span>Verification complete</span>
        </div>
      )}
    </div>
  );
}
