export const metadata = {
  title: "FAQs - Frequently Asked Questions",
  description:
    "Find answers to common questions about Fanboxes mystery boxes, shipping, returns, payments, and more. Get help with your orders and account.",
  openGraph: {
    title: "FAQs - Frequently Asked Questions | Fanboxes",
    description: "Find answers to common questions about mystery boxes, shipping, and more.",
    url: "/faqs",
  },
}

import FaqsClient from "./faqsClient"

export default function FaqsPage() {
  return <FaqsClient />
}
