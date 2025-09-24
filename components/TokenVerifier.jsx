// components/TokenVerifier.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyLoggedInUserToken } from "@/services/auth";
import { Loader } from "lucide-react";
import { toastError } from "@/lib/toast";

export default function TokenVerifier({
  children,
  onVerificationComplete,
  fallback = null,
  showLoader = true,
}) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    verifyToken();
  }, []);

  useEffect(() => {
    if (
      verificationResult &&
      !verificationResult.success &&
      verificationResult.message
    ) {
      toastError(verificationResult.message);
      setVerificationResult(null);
    }
  }, [verificationResult]);

  const verifyToken = async () => {
    try {
      setIsVerifying(true);

      const data = await verifyLoggedInUserToken();

      if (!data.success) {
        setVerificationResult({
          success: false,
          message: data.message || "Authentication failed",
        });

        // Route to login with current path as destination
        const currentRoute = pathname || window.location.pathname;
        router.push(`/login?dest=${encodeURIComponent(currentRoute)}`);
      } else {
        setVerificationResult({
          success: true,
          user: data.user,
          message: data.message,
        });

        if (onVerificationComplete) {
          onVerificationComplete(data.user);
        }
      }
    } catch (error) {
      console.error("Token verification error:", error);
      setVerificationResult({
        success: false,
        message: "Session Expired. Please login to continue",
      });

      // Route to login with current path as destination
      const currentRoute = pathname || window.location.pathname;
      router.push(`/login?dest=${encodeURIComponent(currentRoute)}`);
    } finally {
      setIsVerifying(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-14 h-14 animate-spin text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Show custom fallback if provided
  if (fallback && isVerifying) {
    return fallback;
  }

  // Show loader while verifying
  if (isVerifying && showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-14 h-14 animate-spin text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // If verification failed, the component has already redirected
  // This return shouldn't be reached, but included for completeness
  if (verificationResult && !verificationResult.success) {
    return null;
  }

  // Render children if verification successful
  return children;
}
