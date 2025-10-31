import TermsAndConditionsClient from "./TermsAndConditionsClient"

export const metadata = {
  title: "Terms and Conditions - Legal Terms of Service",
  description:
    "Read the Fanboxes terms and conditions. Understand your rights and responsibilities when using our mystery box platform and purchasing products.",
  openGraph: {
    title: "Terms and Conditions | Fanboxes",
    description: "Legal terms of service for using Fanboxes platform.",
    url: "/terms-and-conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsClient />
}
