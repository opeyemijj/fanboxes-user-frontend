"use client";
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/_main/Header";
import AmbassadorCategories from "@/components/_main/AmbassadorCategories";
import AmbassadorGrid from "@/components/_main/AmbassadorGrid";
import AmbassadorFilterSidebar from "@/components/_main/AmbassadorFilterSidebar";
import Footer from "@/components/_main/Footer";
import { useSelector } from "react-redux";

// Fallback data for ambassadors
const fallbackAmbassadors = [
  {
    id: 1,
    name: "Alex Johnson",
    category: "fitness",
    followers: "150K",
    engagement: "8.2%",
    image: "/placeholder.svg?height=200&width=200",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Sarah Miller",
    category: "beauty",
    followers: "450K",
    engagement: "12.5%",
    image: "/placeholder.svg?height=200&width=200",
    isFeatured: false,
  },
  {
    id: 3,
    name: "Mike Chen",
    category: "tech",
    followers: "1.2M",
    engagement: "5.8%",
    image: "/placeholder.svg?height=200&width=200",
    isFeatured: true,
  },
  {
    id: 4,
    name: "Emily Davis",
    category: "lifestyle",
    followers: "890K",
    engagement: "9.1%",
    image: "/placeholder.svg?height=200&width=200",
    isFeatured: false,
  },
  {
    id: 5,
    name: "David Wilson",
    category: "gaming",
    followers: "2.3M",
    engagement: "7.4%",
    image: "/placeholder.svg?height=200&width=200",
    isFeatured: true,
  },
  {
    id: 6,
    name: "Jessica Brown",
    category: "fashion",
    followers: "1.5M",
    engagement: "10.2%",
    image: "/placeholder.svg?height=200&width=200",
    isFeatured: false,
  },
];

// Fallback categories
const fallbackCategories = [
  { id: "all", name: "All Ambassadors" },
  { id: "fitness", name: "Fitness" },
  { id: "beauty", name: "Beauty" },
  { id: "tech", name: "Tech" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "gaming", name: "Gaming" },
  { id: "fashion", name: "Fashion" },
];

export default function AmbassadorsPage() {
  const [enhancedData, setEnhancedData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");

  // Ambassadors redux data
  const {
    shops,
    loading: shopsLoading,
    error: shopError,
  } = useSelector((state) => state.shops);

  useEffect(() => {
    try {
      const enhancedData = require("@/lib/enhanced-data");
      setEnhancedData(enhancedData);
    } catch (error) {
      console.warn("Enhanced data not available");
      setEnhancedData(null);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Get enhanced data with fallbacks
  const enhancedAmbassadors = enhancedData?.enhancedAmbassadors || [];
  const categories = enhancedData?.categories || fallbackCategories;
  const filterAmbassadorsByCategory =
    enhancedData?.filterAmbassadorsByCategory ||
    ((ambassadors, category) => {
      if (category === "all") return ambassadors;
      return ambassadors.filter((amb) => amb.category === category);
    });
  const searchAmbassadors =
    enhancedData?.searchAmbassadors ||
    ((ambassadors, term) => {
      if (!term) return ambassadors;
      return ambassadors.filter(
        (amb) =>
          amb.name.toLowerCase().includes(term.toLowerCase()) ||
          amb.category.toLowerCase().includes(term.toLowerCase())
      );
    });

  const ambassadorsToUse =
    enhancedAmbassadors.length > 0 ? enhancedAmbassadors : fallbackAmbassadors;

  const filteredAmbassadors = useMemo(() => {
    let filtered = ambassadorsToUse;

    // Apply category filter
    filtered = filterAmbassadorsByCategory(filtered, selectedCategory);

    // Apply search filter
    filtered = searchAmbassadors(filtered, searchTerm);

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
      case "alphabetical":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "most-popular":
      default:
        filtered = [...filtered].sort((a, b) => {
          const aFollowers = parseFollowers(a.followers);
          const bFollowers = parseFollowers(b.followers);
          return bFollowers - aFollowers;
        });
        break;
    }

    return filtered;
  }, [
    ambassadorsToUse,
    selectedCategory,
    searchTerm,
    sortBy,
    filterAmbassadorsByCategory,
    searchAmbassadors,
  ]);

  // Helper function to parse follower strings like "150K", "1.2M"
  function parseFollowers(followerString) {
    if (!followerString) return 0;

    const num = parseFloat(followerString.replace(/[KM]/g, ""));
    if (followerString.includes("M")) return num * 1000000;
    if (followerString.includes("K")) return num * 1000;
    return num;
  }

  // Show loading state during SSR and initial client render
  if (typeof window === "undefined" || isDataLoading || shopsLoading) {
    return (
      <div className="bg-white text-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB]"></div>
              <p className="mt-4 text-lg">Loading ambassadors...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-3/3 xl:w-4/4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-5xl font-bold">Our ambassadors</h1>
              <div className="text-sm text-gray-500">
                {filteredAmbassadors.length} ambassador
                {filteredAmbassadors.length !== 1 ? "s" : ""} found
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
            <div
              className="p-5 rounded-lg mb-4"
              style={{ backgroundColor: "#EFEFEF" }}
            >
              {/* Use either enhanced data or shops from Redux - choose one */}
              <AmbassadorGrid
                ambassadors={shops.length > 0 ? shops : filteredAmbassadors}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
