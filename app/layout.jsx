import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LoadingProvider } from "@/components/LoadingProvider";
import ReduxProvider from "@/components/ReduxProvider";
import NextTopLoader from "nextjs-toploader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastProvider } from "@/components/ToastProvider";
import AgeVerificationModal from "@/components/AgeVerificationModal";
import Header from "@/components/_main/Header";
import Footer from "@/components/_main/Footer";

export const metadata = {
  title: "Fanboxes - Mystery Boxes",
  description: "Every box is a new adventure",
  // generator: "v0.app",
  icons: {
    icon: "/favicon.png", // standard favicon
    shortcut: "/favicon.png", // for legacy browsers
    apple: "/apple-touch-icon.png", // if you want iOS home screen support
  },
};

export default function RootLayout({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
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
          zIndex={99999}
        />
        <ReduxProvider>
          <AuthProvider>
            <LoadingProvider>
              <AgeVerificationModal />
              <GoogleOAuthProvider clientId={clientId}>
                <Header />
                {children}
                <Footer />
              </GoogleOAuthProvider>
              <ToastProvider />
            </LoadingProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
