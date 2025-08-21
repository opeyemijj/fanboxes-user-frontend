"use client"

import Header from "@/components/_main/Header"
import Footer from "@/components/_main/Footer"

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
