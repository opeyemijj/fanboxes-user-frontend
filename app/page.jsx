"use client"
import { useState } from "react"
import Header from "@/components/_main/Header"
import HeroCarousel from "@/components/_main/HeroCarousel"
import LatestBoxes from "@/components/_main/LatestBoxes"
import NewAmbassadors from "@/components/_main/NewAmbassadors"
import Categories from "@/components/_main/Categories"
import TrendingSidebar from "@/components/_main/TrendingSidebar"
import Footer from "@/components/_main/Footer"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="bg-white text-black">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <HeroCarousel />
            <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6 mt-6">
              <LatestBoxes />
            </div>
            <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6">
              <NewAmbassadors />
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Categories</h2>
            <Categories selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <TrendingSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
