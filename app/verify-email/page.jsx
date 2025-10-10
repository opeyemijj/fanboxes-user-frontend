"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { verifyOTP, resendOTP } from "@/services/auth";
import { toastError, toastSuccess } from "@/lib/toast";
import { X } from "lucide-react";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUrl, setIsCheckingUrl] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(""); // "verifying", "success", "error"
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const encodedOtp = searchParams.get("v");

  const inputRefs = useRef([]);
  const formRef = useRef(null); // Add form ref

  // Handle URL encoded OTP
  useEffect(() => {
    if (encodedOtp) {
      try {
        // Decode the OTP from Base64
        const decodedOtp = Buffer.from(encodedOtp, "base64").toString("ascii");

        // Validate that it's a 6-digit number
        if (/^\d{6}$/.test(decodedOtp)) {
          // Auto-fill the OTP inputs
          const otpArray = decodedOtp.split("");
          setOtp(otpArray);

          // Auto-submit after a short delay
          setTimeout(() => {
            handleAutoSubmit(decodedOtp);
          }, 500);
        } else {
          console.warn("Invalid OTP format in URL");
          setIsCheckingUrl(false);
        }
      } catch (error) {
        console.error("Error decoding OTP from URL:", error);
        setIsCheckingUrl(false);
      }
    } else {
      // No encoded OTP in URL
      setIsCheckingUrl(false);
    }
  }, [encodedOtp]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleAutoSubmit = async (otpValue) => {
    setVerificationStatus("verifying");
    setIsLoading(true);

    try {
      const response = await verifyOTP({ otp: otpValue });

      if (response?.success) {
        setVerificationStatus("success");
        toastSuccess("Email verified successfully!");
        setTimeout(() => {
          router.replace("/");
        }, 1500);
      } else {
        setVerificationStatus("error");
        setError(response?.message || "Verification failed");
        toastError("Verification failed");
      }
    } catch (err) {
      setVerificationStatus("error");
      const errorMessage =
        err.response?.data?.message || err.message || "Verification failed";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsCheckingUrl(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // COMMENTED OUT: Auto-submit when all 6 digits are filled
    // if (value && index === 5) {
    //   const fullOtp = [...newOtp].join('');
    //   if (fullOtp.length === 6) {
    //     // Small delay to let user see the last digit
    //     setTimeout(() => {
    //       handleOtpSubmit();
    //     }, 100);
    //   }
    // }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle Enter key press on any input
    if (e.key === "Enter") {
      e.preventDefault();
      const fullOtp = otp.join("");
      if (fullOtp.length === 6 && !isLoading) {
        handleOtpSubmit();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

      // Focus the last input
      const lastFilledIndex = newOtp.length - 1;
      if (lastFilledIndex < 5) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }

      // COMMENTED OUT: Auto-submit if all 6 digits are pasted
      // if (newOtp.length === 6) {
      //   setTimeout(() => {
      //     handleOtpSubmit();
      //   }, 100);
      // }
    }
  };

  const handleOtpSubmit = async (e) => {
    // Prevent default if event exists (from form submission)
    if (e) {
      e.preventDefault();
    }

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    // Prevent double submission
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOTP({ otp: otpValue });

      if (response?.success) {
        setVerificationStatus("success");
        toastSuccess("Email verified successfully!");
        setTimeout(() => {
          router.replace("/");
        }, 900);
      } else {
        setError(response?.message || "Verification failed");
        toastError("Verification failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Verification failed";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);
    setError("");

    try {
      const response = await resendOTP();
      if (response?.success) {
        toastSuccess("Verification code sent!");
      } else {
        toastError(response?.message || "Failed to send verification code");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send verification code";
      toastError(errorMessage);
    }
  };

  // Show loader while checking URL and auto-filling OTP
  if (isCheckingUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="flex flex-col items-center space-y-8">
                {/* Industry standard spinner */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div
                    className="absolute inset-0 border-4 border-transparent border-t-[#11F2EB] rounded-full"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  ></div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Auto-verifying your email
                  </h2>
                  <p className="text-sm text-gray-500">
                    We found your verification code...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show verification status during auto-verification
  if (encodedOtp && verificationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Success State */}
                {verificationStatus === "success" && (
                  <>
                    <div className="relative">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle
                          className="h-10 w-10 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Email verified successfully
                      </h1>
                      <p className="text-gray-600">
                        Redirecting you to the home page...
                      </p>
                    </div>
                  </>
                )}

                {/* Error State */}
                {verificationStatus === "error" && (
                  <>
                    <div className="relative">
                      <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                        <X className="h-10 w-10 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Verification failed
                      </h1>
                      <p className="text-gray-600">
                        {error ||
                          "The verification code is invalid or has expired."}
                      </p>
                    </div>

                    <div className="w-full space-y-3 pt-4">
                      <Button
                        onClick={() => {
                          setVerificationStatus("");
                          setError("");
                          setOtp(["", "", "", "", "", ""]);
                        }}
                        className="w-full bg-[#11F2EB] hover:bg-[#0DD4C7] text-white font-semibold py-3 rounded-xl transition-all duration-200"
                      >
                        Try manual entry
                      </Button>
                      <Link href="/signup" className="block">
                        <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200">
                          Back to signup
                        </Button>
                      </Link>
                    </div>
                  </>
                )}

                {/* Verifying State */}
                {verificationStatus === "verifying" && (
                  <>
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                      <div
                        className="absolute inset-0 border-4 border-transparent border-t-[#11F2EB] rounded-full"
                        style={{ animation: "spin 0.8s linear infinite" }}
                      ></div>
                    </div>

                    <div className="text-center space-y-2">
                      <h1 className="text-xl font-semibold text-gray-900">
                        Verifying your email
                      </h1>
                      <p className="text-gray-600">
                        Please wait while we verify your code...
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Manual OTP verification flow (no encoded OTP found or user chose manual entry)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <Link
              href="/signup"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to signup</span>
            </Link>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#11F2EB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verify your email
              </h1>
              <p className="text-gray-600">
                We've sent a 6-digit verification code to your email address
              </p>
            </div>

            {/* Wrap in form for better Enter key handling */}
            <form
              ref={formRef}
              onSubmit={handleOtpSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter verification code
                </label>
                <div className="flex justify-center space-x-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full bg-[#11F2EB] hover:bg-[#0DD4C7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0}
                  className="text-[#11F2EB] hover:text-[#0DD4C7] font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend code"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
