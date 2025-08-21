"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/Button"
import { Layout } from "@/components/Layout"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-4 pt-32 pb-16">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-[#11F2EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#11F2EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition-colors"
                >
                  Try Again
                </Button>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-600 dark:text-gray-400">No worries, we'll send you reset instructions</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors text-gray-900 dark:text-white"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-[#11F2EB] hover:text-[#0DD4C7] transition-colors">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
