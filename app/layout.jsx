import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"

export const metadata = {
  title: "Fanboxes - Mystery Boxes",
  description: "Every box is a new adventure",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png", // standard favicon
    shortcut: "/favicon.png", // for legacy browsers
    apple: "/apple-touch-icon.png", // if you want iOS home screen support
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
