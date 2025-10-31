import MysteryBoxesClientPage from "./MysteryBoxesClientPage"

export const metadata = {
  title: "Mystery Boxes - Browse All Premium Boxes",
  description:
    "Browse our complete collection of mystery boxes. Filter by category, search for specific boxes, and discover exclusive collectibles from your favorite ambassadors.",
  openGraph: {
    title: "Mystery Boxes - Browse All Premium Boxes | Fanboxes",
    description: "Browse our complete collection of premium mystery boxes and exclusive collectibles.",
    url: "/mystery-boxes",
    images: [
      {
        url: "/og-boxes.png",
        width: 1200,
        height: 630,
        alt: "Fanboxes Mystery Boxes Collection",
      },
    ],
  },
}

export default function MysteryBoxesPage() {
  return <MysteryBoxesClientPage />
}
