"use client"
import { useState, useEffect, useRef } from "react"
import BoxGrid from "@/components/_main/BoxGrid"
import BoxCategories from "@/components/_main/Categories/BoxCategories"
import FilterSidebar from "@/components/_main/FilterSidebar"
import { getAdminOwnedProducts } from "@/services/boxes"
import { useSelector } from "react-redux"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MysteryBoxesClientPage() {
  const reduxCategories = useSelector((state) => state?.categories?.categories || [])

  const [isClient, setIsClient] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const boxesContainerRef = useRef(null)

  const [enhancedData, setEnhancedData] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("most-popular")

  const [adminBoxes, setAdminBoxes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [totalItems, setTotalItems] = useState(0)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToBoxes = () => {
    if (boxesContainerRef.current) {
      const element = boxesContainerRef.current
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - 100 // 100px above the element

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  async function fetchAdminProducts(page = 1, resetFilters = false) {
    setIsLoading(true)
    setError(null)

    try {
      const actualCategory = resetFilters ? "all" : selectedCategory
      const actualSearchTerm = resetFilters ? "" : searchTerm
      const actualSortBy = resetFilters ? "most-popular" : sortBy
      const actualPage = resetFilters ? 1 : page

      const response = await getAdminOwnedProducts({
        page: actualPage,
        limit: itemsPerPage,
        category: actualCategory === "all" ? undefined : actualCategory,
        search: actualSearchTerm,
        sortBy: actualSortBy,
      })

      if (response?.success) {
        setAdminBoxes(response.data || [])
        setTotalItems(response.total || 0)

        if (resetFilters) {
          setSelectedCategory("all")
          setSearchTerm("")
          setSortBy("most-popular")
          setCurrentPage(1)
        }

        if (!isInitialLoad && (actualCategory !== "all" || actualSearchTerm || actualSortBy !== "most-popular")) {
          setTimeout(() => {
            scrollToBoxes()
          }, 100)
        }

        if (isInitialLoad) {
          setIsInitialLoad(false)
        }
      } else {
        console.error("Failed to fetch admin products or invalid data format:", response)
        setError("Failed to load boxes. Please reload the page.")
      }
    } catch (err) {
      console.error("Error fetching admin products:", err)
      setError("Failed to load boxes. Please reload the page.")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (isClient) {
      fetchAdminProducts(currentPage)
    }
  }, [currentPage, selectedCategory, searchTerm, sortBy, isClient])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm, sortBy])

  const handleRetryWithReset = () => {
    fetchAdminProducts(1, true)
  }

  const SkeletonLoader = () => (
    <div className="bg-[#EFEFEF] rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="group animate-pulse">
            <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-300 flex items-center justify-center">
              <div className="w-full h-full bg-gray-400"></div>
              <div className="absolute top-3 left-3 bg-gray-500 h-6 w-12 rounded-full"></div>
              <div className="absolute bottom-3 right-3 bg-gray-500 h-8 w-20 rounded-full"></div>
            </div>
            <div className="mt-2">
              <div className="h-5 bg-gray-400 rounded w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="bg-[#EFEFEF] rounded-lg p-6 flex items-center justify-center h-64">
      <div className="flex flex-col items-center text-center">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">No boxes found</h2>
        <p className="text-lg text-gray-500 mb-4">
          {selectedCategory !== "all" || searchTerm
            ? "Try adjusting your filters or search terms"
            : "There are currently no boxes available."}
        </p>
        <button
          onClick={() => fetchAdminProducts(1, true)}
          className="px-6 py-3 bg-[#11F2EB] text-black rounded-lg hover:bg-opacity-80 transition-colors font-medium"
        >
          {selectedCategory !== "all" || searchTerm ? "Reset Filters" : "Refresh"}
        </button>
      </div>
    </div>
  )

  const Pagination = () => {
    if (totalPages <= 1) return null

    const getVisiblePages = () => {
      const delta = 2
      const range = []
      const rangeWithDots = []

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i)
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...")
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages)
      } else {
        rangeWithDots.push(totalPages)
      }

      return rangeWithDots
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              page === currentPage
                ? "bg-gray-800 text-white shadow-sm"
                : page === "..."
                  ? "text-gray-400 cursor-default"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div className="bg-white text-black">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <SkeletonLoader />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white text-black">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
              <p className="text-lg text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRetryWithReset}
                className="px-6 py-3 bg-[#11F2EB] text-black rounded-lg hover:bg-opacity-80 transition-colors font-medium"
              >
                Try Again (Reset Filters)
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-white text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Mystery Boxes Collection",
            description: "Browse our complete collection of premium mystery boxes",
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/mystery-boxes`,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Mystery Boxes",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/mystery-boxes`,
                },
              ],
            },
          }),
        }}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-3/3 xl:w-4/4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold">Boxes</h1>
              <div className="text-sm text-gray-500">
                {totalItems} box
                {totalItems !== 1 ? "es" : ""} found
              </div>
            </div>

            <div className="mb-8 flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3 xl:w-3/4">
                <BoxCategories
                  categories={reduxCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              <div className="w-full lg:w-1/3 xl:w-1/4 ml-auto">
                <FilterSidebar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>

            <div ref={boxesContainerRef}>
              {isLoading ? (
                <SkeletonLoader />
              ) : adminBoxes.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="bg-[#EFEFEF] rounded-lg p-6">
                  <BoxGrid boxes={adminBoxes} />
                </div>
              )}
            </div>

            <Pagination />

            {totalItems > 0 && adminBoxes.length > 0 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} results
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
