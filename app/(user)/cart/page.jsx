export const metadata = {
  title: "Shopping Cart - Review Your Items",
  description:
    "Review your mystery box selections, update quantities, and proceed to secure checkout. Fast shipping and secure payment guaranteed.",
  openGraph: {
    title: "Shopping Cart | Fanboxes",
    description: "Review your mystery box selections and proceed to checkout.",
    url: "/cart",
  },
  robots: {
    index: false,
    follow: true,
  },
}

import CartClientPage from "./cartClientPage"

export default function CartPage() {
  return <CartClientPage />
}
