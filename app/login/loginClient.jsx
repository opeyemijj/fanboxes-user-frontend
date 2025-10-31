"use client"
import { useState, useRef } from "react"
import TurnstileWidget2 from "@/components/TurnstileWidget2"
import GoogleSignInButton from "@/components/GoogleSignInButton"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/Button"
import { Eye, EyeOff, X, Loader2 } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"

export default function LoginPageClient() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileLoading, setTurnstileLoading] = useState(true)
  const router = useRouter()
  const { login, googleLogin } = useAuth()
  const widgetIdRef = useRef(null)

  const handleGoogleSuccess = async (googleToken) => {
    setGoogleLoading(true)
    setIsLoading(true)
    setError("")

    try {
      const { success, message } = await googleLogin(googleToken)

      if (!success) {
        setError(message || "Login failed")
        setIsLoading(false)
        setGoogleLoading(false)
        return
      }

      setEmail("")
      setPassword("")
      setIsLoading(false)
      setGoogleLoading(false)

      const urlParams = new URLSearchParams(window.location.search)
      const destination = urlParams.get("dest")
      router.push(destination || "/")
    } catch (error) {
      console.error("Google Sign-In error:", error)
      setError("An error occurred during Google Sign-In")
    } finally {
      setGoogleLoading(false)
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    console.error("Google Sign-In failed")
    setError("Google Sign-In was cancelled or failed")
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!turnstileToken) {
      setError("Please complete the security verification")
      return
    }

    setIsLoading(true)
    setError("")

    // Your existing login logic
    console.log("Turnstile Token:", turnstileToken)
    const { success, message } = await login(email, password, turnstileToken)

    if (!success) {
      setError(message || "Login failed")
      setIsLoading(false)
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current)
        setTurnstileToken("")
        setTurnstileLoading(true)
      }
      return
    }

    setEmail("")
    setPassword("")
    setIsLoading(false)

    const urlParams = new URLSearchParams(window.location.search)
    const destination = urlParams.get("dest")
    router.push(destination || "/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Login",
            description: "Sign in to your Fanboxes account",
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/login`,
          }),
        }}
      />
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your fanboxes account</p>
            </div>

            {/* Google Login Button */}
            <div className="w-full mb-6">
              <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} loading={googleLoading} />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error message display */}
              {error && (
                <div className="relative p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm flex items-start">
                  <span className="flex-1">{error}</span>
                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-[#11F2EB] focus:ring-[#11F2EB] border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-[#0DD4C7] hover:text-[#11F2EB] transition-colors">
                  Forgot password?
                </Link>
              </div>

              <TurnstileWidget2
                onTokenChange={setTurnstileToken}
                loading={turnstileLoading}
                setLoading={setTurnstileLoading}
              />

              <Button
                type="submit"
                disabled={isLoading || turnstileLoading || !turnstileToken}
                className="w-full bg-[#0DD4C7] hover:bg-[#11F2EB] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </span>
                ) : turnstileLoading ? (
                  "Waiting for security check..."
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Signup link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
