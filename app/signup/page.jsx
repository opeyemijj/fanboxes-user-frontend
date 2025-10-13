// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button } from "@/components/Button";
// import { Eye, EyeOff, X } from "lucide-react";
// import { useAuth } from "@/components/AuthProvider";

// export default function SignupPage() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [acceptedTerms, setAcceptedTerms] = useState(false);
//   const router = useRouter();
//   const { signup } = useAuth();

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleTermsChange = (e) => {
//     setAcceptedTerms(e.target.checked);
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     const { success, message } = await signup(formData);
//     if (!success) {
//       setError(message || "Signup failed");
//       setIsLoading(false);
//       return;
//     }

//     setFormData({
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//     });
//     setIsLoading(false);
//     // Redirect to verification page instead of home
//     router.push("/verify-email");
//   };

//   const handleGoogleSignup = () => {
//     setIsLoading(true);
//     // Simulate Google signup
//     setTimeout(() => {
//       setIsLoading(false);
//       router.push("/");
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
//       <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
//         <div className="w-full max-w-md">
//           {/* Signup Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//             <div className="text-center mb-8">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">
//                 Create your account
//               </h1>
//               <p className="text-gray-600">
//                 Join fanboxes and start your mystery box journey
//               </p>
//             </div>

//             {/* Google Signup Button */}
//             <Button
//               onClick={handleGoogleSignup}
//               disabled
//               className="w-full mb-6 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 py-3 rounded-xl"
//             >
//               <svg className="w-5 h-5" viewBox="0 0 24 24">
//                 <path
//                   fill="#4285F4"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//               <span className="font-medium">Continue with Google</span>
//             </Button>

//             {/* Divider */}
//             <div className="relative mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">
//                   or continue with email
//                 </span>
//               </div>
//             </div>

//             {/* Signup Form */}
//             <form onSubmit={handleSignup} className="space-y-6">
//               {/* Error message display */}
//               {error && (
//                 <div className="relative p-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm flex items-start">
//                   <span className="flex-1">{error}</span>
//                   <button
//                     type="button"
//                     onClick={() => setError("")}
//                     className="ml-2 text-red-500 hover:text-red-700 transition-colors"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label
//                     htmlFor="firstName"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     First name
//                   </label>
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
//                     placeholder="First name"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="lastName"
//                     className="block text-sm font-medium text-gray-700 mb-2"
//                   >
//                     Last name
//                   </label>
//                   <input
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
//                     placeholder="Last name"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Email address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
//                     placeholder="Create a password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5" />
//                     ) : (
//                       <Eye className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <input
//                   id="terms"
//                   type="checkbox"
//                   required
//                   checked={acceptedTerms}
//                   onChange={handleTermsChange}
//                   className="h-4 w-4 text-[#11F2EB] focus:ring-[#11F2EB] border-gray-300 rounded accent-[#11F2EB]"
//                 />
//                 <label
//                   htmlFor="terms"
//                   className="ml-2 block text-sm text-gray-700"
//                 >
//                   I agree to the{" "}
//                   <Link
//                     href="/terms"
//                     className="text-[#11F2EB] hover:text-[#0DD4C7] transition-colors"
//                   >
//                     Terms of Service
//                   </Link>{" "}
//                   and{" "}
//                   <Link
//                     href="/privacy"
//                     className="text-[#11F2EB] hover:text-[#0DD4C7] transition-colors"
//                   >
//                     Privacy Policy
//                   </Link>
//                 </label>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isLoading || !acceptedTerms}
//                 className="w-full bg-[#11F2EB] hover:bg-[#0DD4C7] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? "Creating account..." : "Create account"}
//               </Button>
//             </form>

//             {/* Login link */}
//             <div className="text-center mt-6">
//               <p className="text-gray-600">
//                 Already have an account?{" "}
//                 <Link
//                   href="/login"
//                   className="text-[#11F2EB] hover:text-[#0DD4C7] font-medium transition-colors"
//                 >
//                   Sign in
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import TurnstileWidget from "@/components/TurnstileWidget";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileLoading, setTurnstileLoading] = useState(true);
  const router = useRouter();
  const { signup } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!turnstileToken) {
      setError("Please complete the security verification");
      return;
    }

    setIsLoading(true);
    setError("");

    // Include turnstile token in your signup request
    console.log("Turnstile Token:", turnstileToken);
    const { success, message } = await signup({ ...formData, turnstileToken });

    if (!success) {
      setError(message || "Signup failed");
      setIsLoading(false);
      // Reset turnstile on failed signup
      if (window.turnstile) {
        // The TurnstileWidget component handles reset internally via the expired-callback
        setTurnstileToken("");
        setTurnstileLoading(true);
      }
      return;
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    setIsLoading(false);
    // Redirect to verification page instead of home
    router.push("/verify-email");
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Simulate Google signup
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-md">
          {/* Signup Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600">
                Join fanboxes and start your mystery box journey
              </p>
            </div>

            {/* Google Signup Button */}
            <Button
              onClick={handleGoogleSignup}
              disabled
              className="w-full mb-6 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 py-3 rounded-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  or continue with email
                </span>
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
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
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
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
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
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#11F2EB] hover:text-[#0DD4C7] transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#11F2EB] hover:text-[#0DD4C7] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Cloudflare Turnstile Widget - Full width and no label */}
              <TurnstileWidget
                onTokenChange={setTurnstileToken}
                loading={turnstileLoading}
                setLoading={setTurnstileLoading}
              />

              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !acceptedTerms ||
                  turnstileLoading ||
                  !turnstileToken
                }
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
    </div>
  );
}
