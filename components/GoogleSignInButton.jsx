"use client";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function GoogleSignInButton({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // credentialResponse.credential is the ID token
      //   console.log("Google credential response:", credentialResponse);
      const idToken = credentialResponse.credential;

      // Send ID token to your backend
      if (idToken) {
        onSuccess(idToken);
      } else {
        onError("Google Sign-In failed");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      onError("Failed to complete Google Sign-In");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
    onError("Google Sign-In failed");
  };

  return (
    <div className="w-full mb-6">
      {loading ? (
        <div className="w-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center space-x-3 py-3 rounded-xl">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Signing in...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          width="100%"
        />
      )}
    </div>
  );
}
