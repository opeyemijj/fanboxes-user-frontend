"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      visibleToasts={5}
      duration={4000}
      toastOptions={{
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #e5e5e5",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },

        success: {
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #11F2EB",
          },
          iconTheme: {
            primary: "#11F2EB",
            secondary: "white",
          },
        },
        error: {
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "white",
          },
        },
        loading: {
          style: {
            background: "#fffbeb",
            color: "#d97706",
            border: "1px solid #fde68a",
          },
        },
      }}
    />
  );
}
