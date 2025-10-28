"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search } from "lucide-react";
import TrendingBoxCard from "@/components/_main/TrendingBoxCard";
import AmbassadorCard from "@/components/_main/AmbassadorCard";
import TrendingSidebarSkeleton from "@/components/ui/skeletons/TrendingSidebarSkeleton";

export default function TrendingSidebar({
  loading = false,
  products = [],
  shops = [],
}) {
  const [activeTab, setActiveTab] = useState("boxes");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Boxes
  const filteredBoxes = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    // Create a working copy and sort it - THREE-LEVEL PRIORITY
    let sortedProducts = [...products].sort((a, b) => {
      // Priority 1: isFeatured (featured items first)
      const aFeatured = a.isFeatured || false;
      const bFeatured = b.isFeatured || false;

      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured; // true (1) comes before false (0)
      }

      // Priority 2: visitedCount (highest first)
      const aVisitedCount = a.visitedCount || 0;
      const bVisitedCount = b.visitedCount || 0;

      if (aVisitedCount !== bVisitedCount) {
        return bVisitedCount - aVisitedCount;
      }

      // Priority 3: createdAt (newest first)
      const aCreatedAt = new Date(a.createdAt || 0);
      const bCreatedAt = new Date(b.createdAt || 0);

      return bCreatedAt - aCreatedAt;
    });

    // Apply search filter and limit
    if (!searchQuery.trim()) return sortedProducts.slice(0, 5);

    const query = searchQuery.toLowerCase();
    const filtered = sortedProducts.filter((product) => {
      return (
        product?.name?.toLowerCase().includes(query) ||
        product?.description?.toLowerCase().includes(query) ||
        product?.categoryDetails?.name?.toLowerCase().includes(query) ||
        product?.shopDetails?.title?.toLowerCase().includes(query) ||
        product?.items?.some((item) =>
          item?.name?.toLowerCase().includes(query)
        )
      );
    });

    return filtered.slice(0, 5);
  }, [products, searchQuery]);

  // Filter Ambassadors
  const filteredAmbassadors = useMemo(() => {
    if (!shops || !Array.isArray(shops)) return [];

    // Create a working copy and sort it - THREE-LEVEL PRIORITY
    let sortedShops = [...shops].sort((a, b) => {
      // Priority 1: isFeatured (featured items first)
      const aFeatured = a.isFeatured || false;
      const bFeatured = b.isFeatured || false;

      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured; // true (1) comes before false (0)
      }

      // Priority 2: visitedCount (highest first)
      const aVisitedCount = a.visitedCount || 0;
      const bVisitedCount = b.visitedCount || 0;

      if (aVisitedCount !== bVisitedCount) {
        return bVisitedCount - aVisitedCount;
      }

      // Priority 3: createdAt (newest first)
      const aCreatedAt = new Date(a.createdAt || 0);
      const bCreatedAt = new Date(b.createdAt || 0);

      return bCreatedAt - aCreatedAt;
    });

    // Apply search filter and limit
    if (!searchQuery.trim()) {
      return sortedShops.slice(0, 5);
    }

    const query = searchQuery.toLowerCase();
    return sortedShops.filter((shop) => {
      return (
        shop?.title?.toLowerCase().includes(query) ||
        shop?.slug?.toLowerCase().includes(query)
      );
    });
  }, [shops, searchQuery]);

  return (
    <aside
      className="p-6 sticky top-24 rounded-xl"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      {/* Loading State */}
      {loading ? (
        <TrendingSidebarSkeleton />
      ) : (
        <>
          {/* Search Section */}
          <div className="relative mb-6">
            <Input
              placeholder={
             'Search'
              }
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold">Trending</h4>
            <div className="flex items-center gap-1 ml-auto">
              <Button
                onClick={() => setActiveTab("boxes")}
                size="sm"
                className={`rounded text-[10px] px-1.5 py-0.5 ${
                  activeTab === "boxes"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-300"
                }`}
              >
                BOXES
              </Button>
              <Button
                onClick={() => setActiveTab("ambassadors")}
                size="sm"
                className={`rounded text-[10px] px-1.5 py-0.5 ${
                  activeTab === "ambassadors"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-300"
                }`}
              >
                AMBASSADORS
              </Button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "boxes" && (
            <div className="space-y-4">
              {filteredBoxes.length > 0 ? (
                filteredBoxes.map((box) => (
                  <TrendingBoxCard key={box._id} box={box} />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No products found</p>
              )}
            </div>
          )}

          {activeTab === "ambassadors" && (
            <div className="space-y-4">
              {filteredAmbassadors.length > 0 ? (
                filteredAmbassadors.map((ambassador) => (
                  <AmbassadorCard
                    key={ambassador._id}
                    ambassador={ambassador}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No ambassadors found</p>
              )}
            </div>
          )}
        </>
      )}
    </aside>
  );
}
