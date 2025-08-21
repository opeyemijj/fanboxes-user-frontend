import "./globals.css"
import ClientLayout from "./ClientLayout"

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>
}

export const metadata = {
      generator: 'v0.app'
    };
