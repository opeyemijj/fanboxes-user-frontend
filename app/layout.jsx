import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LoadingProvider } from "@/components/LoadingProvider";
import ReduxProvider from "@/components/ReduxProvider";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "Fanboxes - Mystery Boxes",
  description: "Every box is a new adventure",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png", // standard favicon
    shortcut: "/favicon.png", // for legacy browsers
    apple: "/apple-touch-icon.png", // if you want iOS home screen support
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader
          color="#11F2EB"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />
        <ReduxProvider>
          <AuthProvider>
            <LoadingProvider>{children}</LoadingProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
