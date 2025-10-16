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
import AmbassadorFilterSidebar from "@/components/_main/AmbassadorFilterSidebar";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useInitialDataFetch } from "@/hooks/useInitialDataFetch";
import { useSearchParams } from "next/navigation";

// Main content component that uses useSearchParams
function AmbassadorsContent() {
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasProcessedQuery, setHasProcessedQuery] = useState(false);
  const [isClient, setIsClient] = useState(false);
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

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log("🔍 Component state:", {
    isClient,
    shopsCount: shopsData.length,
    shopsLoading,
    dataLoading,
    hasError,
  });

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
    console.log("rawS::", shopsData);

    if (categoryFromQuery) {
      // ✅ FIX: Decode the URL parameter to handle spaces and special characters
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
  const scrollToAmbassadorsSection = useCallback(() => {
    if (ambassadorsSectionRef.current) {
      const sectionTop = ambassadorsSectionRef.current.offsetTop;
      const headerOffset = window.innerWidth < 768 ? 100 : 50;
      const scrollPosition = Math.max(0, sectionTop - headerOffset);
      window.scrollTo({ top: scrollPosition, behavior: "smooth" });
    }
  }, []);

  const handleCategoryChange = useCallback(
    (categoryId) => {
      setCurrentPage(1);
      setSelectedCategory((prev) => (prev === categoryId ? "all" : categoryId));
      setTimeout(scrollToAmbassadorsSection, 100);
    },
    [scrollToAmbassadorsSection]
  );

  const handleSearchChange = useCallback((value) => {
    setCurrentPage(1);
    setSearchTerm(value);
  }, []);

  const handleSortChange = useCallback((value) => {
    setCurrentPage(1);
    setSortBy(value);
  }, []);

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
    console.error("❌ Error state:", { hasError, shopError });
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

  return (
    <div className="bg-white text-black">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold">
                Our ambassadors
              </h1>
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

            <div className="mb-8 flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3 xl:w-3/4">
                <AmbassadorCategories
                  categories={reduxCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
              <div className="w-full lg:w-1/3 xl:w-1/4">
                <AmbassadorFilterSidebar
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>

            <div ref={ambassadorsSectionRef}>
              <div className="p-5 rounded-lg mb-4 bg-[#EFEFEF]">
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
