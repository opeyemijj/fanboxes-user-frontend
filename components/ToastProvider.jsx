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
        className: "custom-sonner-toast",
      }}
    />
  );
}
