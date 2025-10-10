"use client";
import { Suspense } from "react";

export default function SuspenseBoundary({ children, fallback = null }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

// Common loading fallbacks you can use
export const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
    <main className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div
                className="absolute inset-0 border-4 border-transparent border-t-[#11F2EB] rounded-full"
                style={{ animation: "spin 0.8s linear infinite" }}
              ></div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Loading...
              </h2>
              <p className="text-sm text-gray-500">Please wait a moment</p>
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

export const SimpleLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-[#11F2EB] rounded-full animate-pulse"></div>
      <div
        className="w-3 h-3 bg-[#11F2EB] rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-3 h-3 bg-[#11F2EB] rounded-full animate-pulse"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  </div>
);
