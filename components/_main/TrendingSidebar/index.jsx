"use client";

import { useState } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Search } from "lucide-react";
import TrendingBoxCard from "@/components/_main/TrendingBoxCard";
import AmbassadorCard from "@/components/_main/AmbassadorCard";
import TrendingSidebarSkeleton from "@/components/ui/skeletons/TrendingSidebarSkeleton";
import { trendingBoxes, trendingAmbassadors } from "@/lib/data-v2";
import { useSelector } from "react-redux";

export default function TrendingSidebar({ loading = false }) {
  const [activeTab, setActiveTab] = useState("boxes");

  const {
    products,
    loading: productsLoading,
    error,
  } = useSelector((state) => state.product);

  const {
    shops,
    loading: shopsLoading,
    error: shopError,
  } = useSelector((state) => state.shops);

  if (productsLoading) {
    return <TrendingSidebarSkeleton />;
  }

  const trendingBoxes = products.slice(0, 3);

  const trendingAssadors = shops.slice(0, 3);

  return (
    <aside
      className="p-6  sticky top-24 rounded-xl"
      style={{ backgroundColor: "#EFEFEF" }}
    >
      <div className="relative mb-6">
        <Input placeholder="Search" className="pr-10" />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

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

      {activeTab === "boxes" && (
        <div className="space-y-4">
          {trendingBoxes?.map((box) => (
            <TrendingBoxCard key={box._id} box={box} />
          ))}
        </div>
      )}
      {activeTab === "ambassadors" && (
        <div className="space-y-4">
          {trendingAssadors?.map((ambassador) => (
            <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
          ))}
        </div>
      )}
    </aside>
  );
}
