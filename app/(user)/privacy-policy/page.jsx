import PrivacyPolicyClient from "./PrivacyPolicyClient"

export const metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description:
    "Read our privacy policy to understand how Fanboxes collects, uses, and protects your personal information. Learn about your privacy rights and data security.",
  openGraph: {
    title: "Privacy Policy | Fanboxes",
    description: "Learn how Fanboxes protects your personal information and privacy.",
    url: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />
}
