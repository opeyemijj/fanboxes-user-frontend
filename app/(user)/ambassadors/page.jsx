"use client";
import {
  useState,
  useMemo,
  useEffect,
  useRef,
  Suspense,
  useCallback,
} from "react";
import AmbassadorCategories from "@/components/_main/AmbassadorCategories";
import AmbassadorGrid from "@/components/_main/AmbassadorGrid";
// import AmbassadorFilterSidebar from "@/components/_main/AmbassadorFilterSidebar";
// import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInitialDataFetch } from "@/hooks/useInitialDataFetch";
import { useSearchParams } from "next/navigation";
import Head from "next/head";

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


// Main content component that uses useSearchParams
function AmbassadorsContent() {
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasProcessedQuery, setHasProcessedQuery] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasRandomized, setHasRandomized] = useState(false);
  const itemsPerPage = 12;

  const ambassadorsSectionRef = useRef(null);

  // Use the proven hook that works in other components
  const {
    shops,
    categories,
    isLoading: dataLoading,
    hasError,
  } = useInitialDataFetch();

  // Extract shops data from the hook response
  const shopsData = shops?.shops || [];
  const shopsLoading = shops?.loading ?? true;
  const shopError = shops?.error || null;
  const reduxCategories = categories?.categories || [];

  // Filter popular influencers
  const popularInfluencers = shopsData?.filter((shop) => shop.isPopular) || [];

  const scrollToAmbassadorsSection = useCallback(() => {
    if (ambassadorsSectionRef.current) {
      const sectionTop = ambassadorsSectionRef.current.offsetTop;
      // Account for sticky nav height (approx 120px) + some padding
      const stickyNavHeight = 120;
      const headerOffset = window.innerWidth < 768 ? 210 : 80;
      const scrollPosition = Math.max(
        0,
        sectionTop - stickyNavHeight - headerOffset
      );
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  }, []);

  // Memoized randomized popular ambassadors - computed once
  const randomizedPopularAmbassadors = useMemo(() => {
    if (isClient && popularInfluencers.length > 0 && !hasRandomized) {
      console.log("🎲 Randomizing popular ambassadors...");
      const shuffled = shuffleArray(popularInfluencers);
      setHasRandomized(true); // Mark as randomized to prevent re-computation
      return shuffled;
    }
    return popularInfluencers; // Return original if not ready to randomize
  }, [isClient, popularInfluencers, hasRandomized]);

  // Handle client-side hydration
  useEffect(() => {
    document.title = "Ambassadors | Fanboxes";
    setIsClient(true);
  }, []);

  // Handle query parameters - only on client side after hydration
  useEffect(() => {
    if (
      !isClient ||
      shopsLoading ||
      hasProcessedQuery ||
      shopsData.length === 0
    ) {
      return;
    }

    console.log("🔍 Processing query parameters");
    const categoryFromQuery = searchParams.get("category");

    if (categoryFromQuery) {
      const decodedCategory = decodeURIComponent(categoryFromQuery);
      console.log("📋 Category from query (decoded):", decodedCategory);

      const matchingShop = shopsData.find(
        (shop) =>
          shop.categoryDetails?.name?.toLowerCase() ===
            decodedCategory.toLowerCase() ||
          shop.categoryDetails?.slug?.toLowerCase() ===
            decodedCategory.toLowerCase()
      );

      if (matchingShop) {
        console.log(
          "✅ Found matching shop, setting category:",
          matchingShop.category
        );
        setSelectedCategory(matchingShop.category);
        // Auto-scroll when category is set from query
        setTimeout(scrollToAmbassadorsSection, 300);
      } else {
        const matchingCategory = reduxCategories.find(
          (cat) =>
            cat.name?.toLowerCase() === decodedCategory.toLowerCase() ||
            cat.slug?.toLowerCase() === decodedCategory.toLowerCase()
        );

        if (matchingCategory) {
          console.log(
            "✅ Found matching category, setting:",
            matchingCategory._id
          );
          setSelectedCategory(matchingCategory._id);
          // Auto-scroll when category is set from query
          setTimeout(scrollToAmbassadorsSection, 300);
        } else {
          console.log("❌ No matching category found for:", decodedCategory);
        }
      }
    }

    setHasProcessedQuery(true);
  }, [
    searchParams,
    isClient,
    shopsLoading,
    shopsData,
    reduxCategories,
    hasProcessedQuery,
    scrollToAmbassadorsSection, // Added dependency
  ]);

  // Filter and sort ambassadors
  const filteredAmbassadors = useMemo(() => {
    if (!shopsData || shopsData.length === 0) return [];

    let filtered = shopsData.filter((shop) => shop && shop.title);

    if (selectedCategory !== "all") {
      filtered = filtered.filter((shop) => shop.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (shop) =>
          shop?.title?.toLowerCase().includes(query) ||
          shop?.slug?.toLowerCase().includes(query) ||
          shop?.categoryDetails?.name?.toLowerCase().includes(query) ||
          shop?.description?.toLowerCase().includes(query)
      );
    }

    // Sorting logic
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "alphabetical":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "most-visited":
        filtered.sort((a, b) => (b.visitedCount || 0) - (a.visitedCount || 0));
        break;
      case "most-popular":
      default:
        filtered.sort((a, b) => {
          const aFeatured = a.isFeatured || false;
          const bFeatured = b.isFeatured || false;
          if (aFeatured !== bFeatured) return bFeatured - aFeatured;
          return (b.visitedCount || 0) - (a.visitedCount || 0);
        });
        break;
    }

    return filtered;
  }, [shopsData, selectedCategory, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAmbassadors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAmbassadors = filteredAmbassadors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers

  const handleCategoryChange = useCallback(
    (categoryId) => {
      setCurrentPage(1);
      setSelectedCategory((prev) => (prev === categoryId ? "all" : categoryId));
      setTimeout(scrollToAmbassadorsSection, 100);
    },
    [scrollToAmbassadorsSection]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setCurrentPage(1);
      setSearchTerm(value);

      // Auto-scroll to results when searching
      if (value?.trim()) {
        setTimeout(() => {
          scrollToAmbassadorsSection();
        }, 300);
      }
    },
    [scrollToAmbassadorsSection]
  );

  const handleSortChange = useCallback(
    (value) => {
      setCurrentPage(1);
      setSortBy(value);
      // Auto-scroll when sort is changed
      setTimeout(scrollToAmbassadorsSection, 100);
    },
    [scrollToAmbassadorsSection]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      setTimeout(scrollToAmbassadorsSection, 100);
    },
    [scrollToAmbassadorsSection]
  );

  // ✅ FIXED: Show loading until client hydration AND data is loaded
  if (!isClient || dataLoading || shopsLoading) {
    return (
      <div className="bg-white text-black">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB]"></div>
              <p className="mt-4 text-lg">Loading ambassadors...</p>
              <p className="mt-2 text-sm text-gray-500">
                {!isClient ? "Hydrating..." : "Fetching data..."}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (hasError || shopError) {
    return (
      <div className="bg-white text-black">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Error loading ambassadors
              </h3>
              <p className="text-gray-500 mb-4">
                {shopError || hasError || "Unknown error occurred"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#11F2EB] text-white rounded hover:bg-cyan-500"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  // useEffect(() => {
  //   document.title = "Events | SpyceChain";
  // }, []);



  return (
    <div className="bg-white text-black">

<Head>
        <title>Events | SpyceChain</title>
        <meta
          name="description"
          content="Discover and join exciting events happening on SpyceChain."
        />
        <meta property="og:title" content="Events | SpyceChain" />
        <meta
          property="og:description"
          content="Explore trending events and community activities on SpyceChain."
        />
        <meta property="og:image" content="/images/spycechain-banner.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>


      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold">
              Ambassadors
            </h1>
          </div>

          {/* Categories Section - Only on mobile */}
          <div className="block lg:hidden bg-white py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <AmbassadorCategories
                categories={reduxCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>

          {/* Sticky Navigation Bar - Categories + Filters on desktop, only Filters on mobile */}
          <div className="sticky top-16 z-40 bg-white py-4 shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:items-center">
                {/* Categories - Only on desktop */}
                <div className="hidden lg:block lg:flex-1">
                  <AmbassadorCategories
                    categories={reduxCategories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>

                {/* Search and Sort - Right Side - Always visible */}
                <div className="w-full lg:w-auto">
                  <div className="flex flex-col gap-4">
                    {/* Search Input */}
                    <div className="w-full lg:w-80">
                      <input
                        type="text"
                        placeholder="Search ambassadors..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent"
                      />
                    </div>
                    {/* Sort Select */}
                    <div className="w-full lg:w-80">
                      <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent"
                      >
                        {/* <option value="most-popular">Most Popular</option> */}
                        <option value="newest">Newest</option>
                        <option value="alphabetical">Alphabetical</option>
                        <option value="most-visited">Most Visited</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Counter */}
              {searchTerm && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="bg-[#11F2EB] bg-opacity-20 px-3 py-1 rounded-full">
                    {filteredAmbassadors.length} results found for "{searchTerm}
                    "
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col gap-8 mt-4">
            {/* Popular Ambassadors Section */}
            {randomizedPopularAmbassadors.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Popular Ambassadors
                  </h2>
                  <span className="text-sm text-gray-500">
                    {randomizedPopularAmbassadors.length} popular
                  </span>
                </div>
                <div className="p-5 rounded-lg bg-[#EFEFEF]">
                  <AmbassadorGrid
                    ambassadors={randomizedPopularAmbassadors}
                    key={`popular-ambassadors-${randomizedPopularAmbassadors.length}`}
                  />
                </div>
              </section>
            )}

            {/* Main Ambassadors Section */}
            <div ref={ambassadorsSectionRef}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Our Ambassadors
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredAmbassadors.length} ambassador
                  {filteredAmbassadors.length !== 1 ? "s" : ""} found
                  {filteredAmbassadors.length > itemsPerPage && (
                    <span className="ml-2">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 rounded-lg bg-[#EFEFEF]">
                {paginatedAmbassadors.length > 0 ? (
                  <AmbassadorGrid
                    ambassadors={paginatedAmbassadors}
                    key={`ambassadors-grid-${paginatedAmbassadors.length}-${currentPage}`}
                  />
                ) : shopsData.length > 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No ambassadors match your filters
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="mt-2 px-4 py-2 bg-[#11F2EB] text-white rounded hover:bg-cyan-500 text-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No ambassadors found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={`page-${page}`}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === currentPage
                          ? "bg-gray-800 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Loading component for Suspense fallback
function AmbassadorsLoading() {
  return (
    <div className="bg-white text-black">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB]"></div>
            <p className="mt-4 text-lg">Loading ambassadors...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main component with Suspense boundary
export default function AmbassadorsPage() {
  return (
    <Suspense fallback={<AmbassadorsLoading />}>
      <AmbassadorsContent />
    </Suspense>
  );
}
