"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search } from "lucide-react";
import TrendingBoxCard from "@/components/_main/TrendingBoxCard";
import AmbassadorCard from "@/components/_main/AmbassadorCard";
import TrendingSidebarSkeleton from "@/components/ui/skeletons/TrendingSidebarSkeleton";
import { useSelector } from "react-redux";

export default function TrendingSidebar({ loading = false }) {
  const [activeTab, setActiveTab] = useState("boxes");
  const [searchQuery, setSearchQuery] = useState("");

  const { products, loading: productsLoading } = useSelector(
    (state) => state.product
  );
  const { shops, loading: shopsLoading } = useSelector((state) => state.shops);

  // Filter Boxes
  const filteredBoxes = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products.slice(0, 5);

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
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
  }, [products, searchQuery]);

  // Filter Ambassadors
  const filteredAmbassadors = useMemo(() => {
    console.log("shopsFromFilt::", shops);
    if (!shops) return [];

    // Create a working copy and sort it
    let sortedShops = [...shops].sort((a, b) => {
      // First, sort by isFeatured (featured items first)
      const aFeatured = a.isFeatured || false;
      const bFeatured = b.isFeatured || false;

      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured; // true (1) comes before false (0)
      }

      // If both have same featured status, sort by visitedCount (highest first)
      const aVisitedCount = a.visitedCount || 0;
      const bVisitedCount = b.visitedCount || 0;

      return bVisitedCount - aVisitedCount;
    });

    console.log("sortedShops::", sortedShops);

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
      {productsLoading || shopsLoading ? (
        <TrendingSidebarSkeleton />
      ) : (
        <>
          {/* Search Section */}
          <div className="relative mb-6">
            <Input
              placeholder={
                activeTab === "boxes"
                  ? "Search products..."
                  : "Search ambassadors..."
              }
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Trending</h3>
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
                  <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
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
