"use client"
import { useState, useMemo } from "react"
import Header from "@/components/_main/Header"
import FilterSidebar from "@/components/_main/FilterSidebar"
import BoxGrid from "@/components/_main/BoxGrid"
import Categories from "@/components/_main/Categories"
import Footer from "@/components/_main/Footer"

// Import enhanced data with fallback
let enhancedMysteryBoxes, categories, filterBoxesByCategory, searchBoxes, sortBoxes

try {
  const enhancedData = require("@/lib/enhanced-data")
  enhancedMysteryBoxes = enhancedData.enhancedMysteryBoxes || []
  categories = enhancedData.categories || []
  filterBoxesByCategory = enhancedData.filterBoxesByCategory || ((boxes) => boxes)
  searchBoxes = enhancedData.searchBoxes || ((boxes) => boxes)
  sortBoxes = enhancedData.sortBoxes || ((boxes) => boxes)
} catch (error) {
  console.warn("Enhanced data not available, using fallback data")
  enhancedMysteryBoxes = []
  categories = []
  filterBoxesByCategory = (boxes) => boxes
  searchBoxes = (boxes) => boxes
  sortBoxes = (boxes) => boxes
}

export default function MysteryBoxesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("most-popular")

  // Fallback data for demonstration
  const fallbackBoxes = [
    {
      id: 1,
      title: "Tech Bundle",
      creator: "TechGuru",
      image: "/placeholder.svg?height=300&width=400",
      isNew: true,
      category: "tech",
      price: 150,
      description: "Latest tech gadgets and accessories",
      itemCount: 8,
      totalValue: 500,
      rarity: "rare",
    },
    {
      id: 2,
      title: "Gaming Box",
      creator: "GameMaster",
      image: "/placeholder.svg?height=300&width=400",
      isNew: false,
      category: "gaming",
      price: 125,
      description: "Exclusive gaming collectibles and gear",
      itemCount: 6,
      totalValue: 400,
      rarity: "epic",
    },
    {
      id: 3,
      title: "Beauty Essentials",
      creator: "Ashley Powers",
      image: "/placeholder.svg?height=300&width=400",
      isNew: true,
      category: "beauty",
      price: 100,
      description: "Premium beauty products handpicked by experts",
      itemCount: 10,
      totalValue: 350,
      rarity: "rare",
    },
    {
      id: 4,
      title: "Lifestyle Luxury",
      creator: "Lifestyle Luna",
      image: "/placeholder.svg?height=300&width=400",
      isNew: false,
      category: "lifestyle",
      price: 200,
      description: "Curated luxury items for modern living",
      itemCount: 7,
      totalValue: 600,
      rarity: "legendary",
    },
    {
      id: 5,
      title: "Fitness Power Pack",
      creator: "Fitness Frank",
      image: "/placeholder.svg?height=300&width=400",
      isNew: true,
      category: "fitness",
      price: 80,
      description: "Essential fitness gear and supplements",
      itemCount: 9,
      totalValue: 250,
      rarity: "common",
    },
    {
      id: 6,
      title: "Sports Champions Box",
      creator: "Sports Star Sam",
      image: "/placeholder.svg?height=300&width=400",
      isNew: false,
      category: "sports",
      price: 120,
      description: "Premium sports gear and memorabilia",
      itemCount: 8,
      totalValue: 400,
      rarity: "rare",
    },
  ]

  const boxesToUse = enhancedMysteryBoxes.length > 0 ? enhancedMysteryBoxes : fallbackBoxes

  const filteredBoxes = useMemo(() => {
    let filtered = boxesToUse

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((box) => box.category === selectedCategory)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (box) =>
          box.title.toLowerCase().includes(term) ||
          box.creator.toLowerCase().includes(term) ||
          (box.description && box.description.toLowerCase().includes(term)),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id)
        break
      case "price-low-high":
        filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-high-low":
        filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "most-popular":
      default:
        filtered = [...filtered].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0))
        break
    }

    return filtered
  }, [boxesToUse, selectedCategory, searchTerm, sortBy])

  return (
    <div className="bg-white text-black">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-3/3 xl:w-4/4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-5xl font-bold">Mystery boxes</h1>
              <div className="text-sm text-gray-500">
                {filteredBoxes.length} box{filteredBoxes.length !== 1 ? "es" : ""} found
              </div>
            </div>

            <div className="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <Categories
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              <div className="lg:w-80 flex-shrink-0">
                <FilterSidebar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </div>

            <div className="bg-[#EFEFEF] rounded-lg p-6">
              <BoxGrid boxes={filteredBoxes} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
