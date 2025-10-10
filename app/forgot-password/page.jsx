"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowLeft, Mail } from "lucide-react";
import { forgetPassword } from "@/services/auth";
import { toastError, toastSuccess } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Make the actual API call
      const payload = { email };
      const response = await forgetPassword(payload);
      // console.log("Forgot password response:", response);

      // If we get here, the API call was successful
      if (response.success) {
        setIsLoading(false);
        setIsSubmitted(true);
        toastSuccess("Password reset link sent successfully!");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Forgot password error:", err);

      // Handle different error scenarios
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset link. Please try again.";

      setError(errorMessage);
      toastError(errorMessage);
    }
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* <Header /> */}

        <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
          <div className="w-full max-w-md">
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-[#11F2EB] rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Check your email
              </h1>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleSendAnother}
                  className="w-full bg-[#11F2EB] hover:bg-[#0DD4C7] text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Send another email
                </Button>

                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="mt-2 w-full text-gray-600 hover:text-gray-800 hover:bg-transparent transition-colors"
                  >
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* <Header /> */}

      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-md">
          {/* Forgot Password Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Back to login link */}
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to login</span>
            </Link>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Forgot your password?
              </h1>
              <p className="text-gray-600">
                No worries! Enter your email address and we'll send you a link
                to reset your password.
              </p>
            </div>

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-[#11F2EB] hover:bg-[#0DD4C7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {isLoading ? "Sending reset link..." : "Send reset link"}
              </Button>
            </form>

            {/* Additional help */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-[#11F2EB] hover:text-[#0DD4C7] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
