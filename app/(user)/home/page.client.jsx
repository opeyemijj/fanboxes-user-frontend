"use client"
import { useState } from "react"
import Hero from "@/components/_main/HomeHero"
import LatestBoxes from "@/components/_main/LatestBoxes"
import NewAmbassadors from "@/components/_main/NewAmbassadors"
import Categories from "@/components/_main/Categories"
import TrendingSidebar from "@/components/_main/TrendingSidebar"

export default function HomePageV2Client() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Fanboxes Home",
            description: "Discover the latest mystery boxes from top ambassadors",
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/home`,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/home`,
                },
              ],
            },
          }),
        }}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <Hero />
            <div className="mt-4 py-5 px-5 rounded-xl" style={{ backgroundColor: "#EFEFEF" }}>
              <LatestBoxes />
            </div>
            <div className="mt-4 py-5 px-5 rounded-xl" style={{ backgroundColor: "#EFEFEF" }}>
              <NewAmbassadors />
            </div>
            <Categories selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <TrendingSidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
