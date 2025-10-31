export const metadata = {
  title: "Sign Up - Create Your Fanboxes Account",
  description:
    "Join Fanboxes today! Create your free account to start discovering exclusive mystery boxes, track your orders, and get access to special offers.",
  openGraph: {
    title: "Sign Up | Fanboxes",
    description: "Create your Fanboxes account and start your mystery box journey.",
    url: "/signup",
  },
  robots: {
    index: false,
    follow: true,
  },
}

import SignupClientPage from "./signup-client"

export default function SignupPage() {
  return <SignupClientPage />
}
