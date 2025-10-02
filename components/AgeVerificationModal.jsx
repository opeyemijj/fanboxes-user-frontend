"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem("ageVerified");
    if (!hasVerified) {
      setIsOpen(true);
    } else {
      setIsVerified(true);
    }
  }, []);

  const handleConfirm = () => {
    // Set verification in localStorage
    localStorage.setItem("ageVerified", "true");
    setIsVerified(true);
    setIsOpen(false);
  };

  const handleDeny = () => {
    if (typeof window !== "undefined") {
      document.body.innerHTML = `
      <div style="
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        background: #1a202c; 
        color: white; 
        font-family: system-ui, -apple-system, sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 99999;
      ">
        <div style="
          text-align: center; 
          padding: 2rem;
          max-width: 400px;
          width: 90%;
        ">
          <!-- Icon -->
          <div style="
            width: 80px;
            height: 80px;
            background: #dc2626;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            border: 4px solid #fecaca;
          ">
            <svg style="width: 40px; height: 40px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>

          <!-- Title -->
          <h1 style="font-size: 2rem; margin-bottom: 1rem; font-weight: bold;">
            Access Restricted
          </h1>

          <!-- Message -->
          <div style="margin-bottom: 2rem;">
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #e2e8f0; font-weight: 500;">
              Age Verification Required
            </p>
            <p style="font-size: 0.9rem; color: #a0aec0; line-height: 1.5;">
              This website contains content intended for adults 18 years and older. 
              Access has been restricted in accordance with our terms of service.
            </p>
          </div>

          <!-- Warning Box -->
          <div style="
            background: #fed7d7;
            border: 1px solid #feb2b2;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 2rem;
          ">
            <div style="display: flex; align-items: center; justify-content: center;">
              <svg style="width: 20px; height: 20px; color: #c53030; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span style="font-size: 0.875rem; color: #742a2a; font-weight: 500;">
                You must be 18+ to access this content
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
            <button 
              onclick="localStorage.removeItem('ageVerified'); window.location.reload();"
              style="
                width: 100%;
                padding: 0.875rem 1rem;
                background: linear-gradient(135deg, #11F2EB, #0ED9D3);
                color: #1e293b;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
              "
              onmouseover="this.style.opacity='0.9'"
              onmouseout="this.style.opacity='1'"
            >
              Retry Age Verification
            </button>
            
            <button 
              onclick="window.close()"
              style="
                width: 100%;
                padding: 0.875rem 1rem;
                background: #4a5568;
                color: white;
                border: none;
                border-radius: 12px;
                font-weight: 500;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
              "
              onmouseover="this.style.background='#718096'"
              onmouseout="this.style.background='#4a5568'"
            >
              Exit Website
            </button>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #4a5568; padding-top: 1rem;">
            <p style="font-size: 0.75rem; color: #718096;">
              Need assistance? Contact
              <a 
                href="mailto:support@fanboxes.com" 
                style="color: #11F2EB; text-decoration: none; font-weight: 500;"
                onmouseover="this.style.textDecoration='underline'"
                onmouseout="this.style.textDecoration='none'"
              >
                support@fanboxes.com
              </a>
            </p>
          </div>
        </div>
      </div>
    `;
    }
  };

  // Don't render anything if verified or if not open yet
  if (isVerified || !isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-center">
              <div className="w-16 h-16 bg-[#11F2EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#11F2EB]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Age Verification Required
              </h2>
              <p className="text-slate-300">
                You must be 18 years or older to enter this website
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-800 font-medium mb-1">
                      Age Restriction Notice
                    </p>
                    <p className="text-xs text-amber-700">
                      This website contains content suitable for adults only. By
                      entering, you confirm that you are 18 years of age or
                      older and agree to our Terms of Service and Privacy
                      Policy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDeny}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
                >
                  I'm Under 18
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 font-semibold rounded-xl hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200 shadow-sm"
                >
                  I'm 18 or Older
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By clicking "I'm 18 or Older", you agree to our{" "}
                <a href="/terms" className="text-[#11F2EB] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#11F2EB] hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AgeVerificationModal;
