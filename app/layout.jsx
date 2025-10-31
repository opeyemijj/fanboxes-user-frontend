import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"
import { LoadingProvider } from "@/components/LoadingProvider"
import ReduxProvider from "@/components/ReduxProvider"
import NextTopLoader from "nextjs-toploader"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { ToastProvider } from "@/components/ToastProvider"
import AgeVerificationModal from "@/components/AgeVerificationModal"
import Header from "@/components/_main/Header"
import Footer from "@/components/_main/Footer"

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"),
  title: {
    default: "Fanboxes - Premium Mystery Boxes & Collectibles",
    template: "%s | Fanboxes",
  },
  description:
    "Discover exclusive mystery boxes curated by your favorite ambassadors. Every box is a new adventure filled with premium collectibles, merchandise, and surprises.",
  keywords: [
    "mystery boxes",
    "collectibles",
    "fan merchandise",
    "surprise boxes",
    "ambassador boxes",
    "premium collectibles",
    "subscription boxes",
  ],
  authors: [{ name: "Fanboxes" }],
  creator: "Fanboxes",
  publisher: "Fanboxes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Fanboxes",
    title: "Fanboxes - Premium Mystery Boxes & Collectibles",
    description: "Discover exclusive mystery boxes curated by your favorite ambassadors. Every box is a new adventure.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fanboxes - Premium Mystery Boxes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fanboxes - Premium Mystery Boxes & Collectibles",
    description: "Discover exclusive mystery boxes curated by your favorite ambassadors.",
    images: ["/og-image.png"],
    creator: "@fanboxes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Fanboxes",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/favicon.png`,
              description: "Premium mystery boxes and collectibles curated by your favorite ambassadors",
              sameAs: [
                "https://twitter.com/fanboxes",
                "https://facebook.com/fanboxes",
                "https://instagram.com/fanboxes",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@fanboxes.com",
                contactType: "Customer Service",
              },
            }),
          }}
        />
      </head>
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
  )
}
