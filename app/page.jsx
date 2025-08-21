"use client"
import { useState } from "react"
import { Layout } from "@/components/Layout"
import HeroCarousel from "@/components/_main/HeroCarousel"
import LatestBoxes from "@/components/_main/LatestBoxes"
import NewAmbassadors from "@/components/_main/NewAmbassadors"
import Categories from "@/components/_main/Categories"
import TrendingSidebar from "@/components/_main/TrendingSidebar"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <HeroCarousel />
            <div className="bg-[#EFEFEF] dark:bg-gray-800 rounded-lg p-4 mb-6 mt-6 transition-colors duration-200">
              <LatestBoxes />
            </div>
            <div className="bg-[#EFEFEF] dark:bg-gray-800 rounded-lg p-4 mb-6 transition-colors duration-200">
              <NewAmbassadors />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Categories</h2>
            <Categories selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </Layout>
  )
}
