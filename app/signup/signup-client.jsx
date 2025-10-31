"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/Button"
import { Eye, EyeOff, X, Loader2 } from "lucide-react"
import { useAuth } from "@/components/AuthProvider"
import TurnstileWidget2 from "@/components/TurnstileWidget2"
import GoogleSignInButton from "@/components/GoogleSignInButton"

export default function SignupClientPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileLoading, setTurnstileLoading] = useState(true)
  const router = useRouter()
  const { signup, googleLogin } = useAuth()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked)
  }

  const handleGoogleSuccess = async (googleToken) => {
    setGoogleLoading(true)
    setIsLoading(true)
    setError("")

    try {
      const { success, message } = await googleLogin(googleToken)

      if (!success) {
        setError(message || "Google Sign-Up failed")
        setIsLoading(false)
        setGoogleLoading(false)
        return
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      })
      setIsLoading(false)
      setGoogleLoading(false)

      router.push("/")
    } catch (error) {
      console.error("Google Sign-Up error:", error)
      setError("An error occurred during Google Sign-Up")
    } finally {
      setGoogleLoading(false)
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    console.error("Google Sign-Up failed")
    setError("Google Sign-Up was cancelled or failed")
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!turnstileToken) {
      setError("Please complete the security verification")
      return
    }

    setIsLoading(true)
    setError("")

    // Include turnstile token in your signup request
    console.log("Turnstile Token:", turnstileToken)
    const { success, message } = await signup({ ...formData, turnstileToken })

    if (!success) {
      setError(message || "Signup failed")
      setIsLoading(false)
      // Reset turnstile on failed signup
      if (window.turnstile) {
        setTurnstileToken("")
        setTurnstileLoading(true)
      }
      return
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    })
    setIsLoading(false)
    // Redirect to verification page instead of home
    router.push("/verify-email")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Sign Up",
            description: "Create a new Fanboxes account",
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/signup`,
          }),
        }}
      />
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-md">
          {/* Signup Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600">Join fanboxes and start your mystery box journey</p>
            </div>

            {/* Google Signup Button */}
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

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-6">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Create a password"
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

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  checked={acceptedTerms}
                  onChange={handleTermsChange}
                  className="h-4 w-4 text-[#11F2EB] focus:ring-[#11F2EB] border-gray-300 rounded accent-[#11F2EB]"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#11F2EB] hover:text-[#0DD4C7] transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#11F2EB] hover:text-[#0DD4C7] transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Cloudflare Turnstile Widget - Full width and no label */}
              <TurnstileWidget2
                onTokenChange={setTurnstileToken}
                loading={turnstileLoading}
                setLoading={setTurnstileLoading}
              />

              <Button
                type="submit"
                disabled={isLoading || !acceptedTerms || turnstileLoading || !turnstileToken}
                className="w-full bg-[#11F2EB] hover:bg-[#0DD4C7] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Creating account...
                  </span>
                ) : turnstileLoading ? (
                  "Waiting for security check..."
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Login link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-[#11F2EB] hover:text-[#0DD4C7] font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
