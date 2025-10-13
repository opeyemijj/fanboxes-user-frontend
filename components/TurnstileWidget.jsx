"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2, Shield } from "lucide-react";

export default function TurnstileWidget({
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  onTokenChange = () => {}, // callback when token is received or expired
  theme = "light",
  className = "",
  loading = true,
  setLoading = () => {},
}) {
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  //   const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // Load Turnstile script if not already present
    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      script.onerror = () => {
        console.error("❌ Failed to load Turnstile script.");
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      renderTurnstile();
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTurnstile = () => {
    if (widgetIdRef.current || !turnstileRef.current || !window.turnstile)
      return;

    try {
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (tokenValue) => {
          console.log("Turnstile token received:", tokenValue);
          setToken(tokenValue);
          setLoading(false);
          onTokenChange(tokenValue);
        },
        "error-callback": () => {
          console.error("⚠️ Turnstile verification failed.");
          setLoading(false);
          if (onTokenChange) onTokenChange("");
        },
        "expired-callback": () => {
          setToken("");
          setLoading(true);
          if (onTokenChange) onTokenChange("");
          if (window.turnstile && widgetIdRef.current) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
        theme,
        size: "flexible", // allows full-width scaling
      });
    } catch (err) {
      console.error("Turnstile render error:", err);
      setLoading(false);
    }
  };

  return (
    <div className={`relative w-full min-h-[65px] ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center bg-white bg-opacity-90 rounded-xl z-10">
          <div className="flex items-center space-x-2 text-gray-600 pl-1">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">
              Loading security check...
            </span>
          </div>
        </div>
      )}
      <div
        ref={turnstileRef}
        className="w-full flex justify-center items-center [&>div]:w-full [&>iframe]:w-full"
      ></div>

      {token && !loading && (
        <div className="flex items-center text-green-600 text-sm mt-2">
          <Shield className="h-4 w-4 mr-1" />
          <span>Verification complete</span>
        </div>
      )}
    </div>
  );
}
