"use client"

import { Button } from "@/components/Button"

export default function AmbassadorCategories({
  categories = [],
  selectedCategory = "all",
  onCategoryChange = () => {},
}) {
  // Default ambassador categories if none provided
  const defaultCategories = [
    { id: "all", name: "ALL", slug: "all" },
    { id: "tech", name: "TECH", slug: "tech" },
    { id: "gaming", name: "GAMING", slug: "gaming" },
    { id: "beauty", name: "BEAUTY", slug: "beauty" },
    { id: "lifestyle", name: "LIFESTYLE", slug: "lifestyle" },
    { id: "fitness", name: "FITNESS & HEALTH", slug: "fitness-health" },
    { id: "food", name: "FOOD & BEVERAGE", slug: "food-beverage" },
    { id: "travel", name: "TRAVEL", slug: "travel" },
    { id: "collectors", name: "COLLECTORS / HOBBYISTS", slug: "collectors-hobbyists" },
    { id: "diy", name: "DIY / CRAFT", slug: "diy-craft" },
    { id: "family", name: "FAMILY", slug: "family" },
    { id: "books", name: "BOOKS & LITERATURE", slug: "books-literature" },
    { id: "entertainment", name: "ENTERTAINMENT & CELEBRITIES", slug: "entertainment-celebrities" },
    { id: "jewellery", name: "JEWELLERY", slug: "jewellery" },
    { id: "cars", name: "CARS & BIKES", slug: "cars-bikes" },
    { id: "sports", name: "SPORTS", slug: "sports" },
    { id: "onlyfans", name: "ONLY FANS", slug: "only-fans" },
    { id: "crypto", name: "STOCKS & CRYPTO", slug: "stocks-crypto" },
  ]

  const categoriesToUse = categories.length > 0 ? categories : defaultCategories

  return (
    <section className="my-2">
      <div className="flex flex-wrap gap-2">
        {categoriesToUse.map((category) => (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-full transition-all duration-200 ${
              selectedCategory === category.id ? "text-black" : "text-white"
            }`}
            variant={selectedCategory === category.id ? "default" : "outline"}
            style={{
              backgroundColor: selectedCategory === category.id ? "#11F2EB" : "#98989F",
            }}
          >
            {category.name}
            {selectedCategory === category.id ? (
              <span className="ml-2 text-sm">×</span>
            ) : (
              <span className="ml-2 text-sm">→</span>
            )}
          </Button>
        ))}
      </div>
    </section>
  )
}
