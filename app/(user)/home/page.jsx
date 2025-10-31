import HomePageV2Client from "./page.client"

export const metadata = {
  title: "Home - Discover Premium Mystery Boxes",
  description:
    "Explore the latest mystery boxes from top ambassadors. Find trending boxes, new releases, and exclusive collectibles. Start your mystery box adventure today.",
  openGraph: {
    title: "Fanboxes - Discover Premium Mystery Boxes",
    description: "Explore the latest mystery boxes from top ambassadors and exclusive collectibles.",
    url: "/home",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Fanboxes Home - Latest Mystery Boxes",
      },
    ],
  },
}

export default function HomePageV2() {
  return <HomePageV2Client />
}
