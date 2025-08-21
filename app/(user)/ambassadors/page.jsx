"use client"
import { useState, useMemo } from "react"
import Header from "@/components/_main/Header"
import AmbassadorCategories from "@/components/_main/AmbassadorCategories"
import AmbassadorGrid from "@/components/_main/AmbassadorGrid"
import AmbassadorFilterSidebar from "@/components/_main/AmbassadorFilterSidebar"
import Footer from "@/components/_main/Footer"
import { enhancedAmbassadors, categories, filterAmbassadorsByCategory, searchAmbassadors } from "@/lib/enhanced-data"

export default function AmbassadorsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("most-popular")

  const filteredAmbassadors = useMemo(() => {
    let filtered = enhancedAmbassadors

    // Apply category filter
    filtered = filterAmbassadorsByCategory(filtered, selectedCategory)

    // Apply search filter
    filtered = searchAmbassadors(filtered, searchTerm)

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id)
        break
      case "alphabetical":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      case "most-popular":
      default:
        filtered = [...filtered].sort((a, b) => {
          const aFollowers =
            Number.parseFloat(a.followers.replace(/[KM]/g, "")) * (a.followers.includes("M") ? 1000000 : 1000)
          const bFollowers =
            Number.parseFloat(b.followers.replace(/[KM]/g, "")) * (b.followers.includes("M") ? 1000000 : 1000)
          return bFollowers - aFollowers
        })
        break
    }

    return filtered
  }, [selectedCategory, searchTerm, sortBy])

  return (
    <div className="bg-white text-black">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-3/3 xl:w-4/4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-5xl font-bold">Our ambassadors</h1>
              <div className="text-sm text-gray-500">
                {filteredAmbassadors.length} ambassador{filteredAmbassadors.length !== 1 ? "s" : ""} found
              </div>
            </div>
            <div className="mb-8 flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3 xl:w-3/4">
                 <AmbassadorCategories
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              </div>
             
              <div className="w-full lg:w-1/3 xl:w-1/4">
            <AmbassadorFilterSidebar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
            </div>
            <div className="p-5 rounded-lg mb-4" style={{backgroundColor:"#EFEFEF"}}>
              
             <AmbassadorGrid ambassadors={filteredAmbassadors} />

            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  )
}
