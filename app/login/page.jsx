import LoginPageClient from "./loginClient"

export const metadata = {
  title: "Login - Sign In to Your Account",
  description:
    "Sign in to your Fanboxes account to access your orders, track shipments, manage your profile, and discover exclusive mystery boxes.",
  openGraph: {
    title: "Login | Fanboxes",
    description: "Sign in to your Fanboxes account.",
    url: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function LoginPage() {
  return <LoginPageClient />
}
