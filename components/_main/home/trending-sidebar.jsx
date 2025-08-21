"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { TrendingBoxCard } from "./trending-box-card"
import AmbassadorCard from "@/components/_main/AmbassadorCard"
import { trendingBoxes, trendingAmbassadors } from "@/lib/data-v2"

export default function TrendingSidebar() {
  const [activeTab, setActiveTab] = useState("boxes")

  return (
    <aside className="bg-gray-50 p-6 rounded-lg sticky top-24">
      <div className="relative mb-6">
        <Input placeholder="Search" className="pr-10" />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <h3 className="text-2xl font-bold">Trending</h3>
      <div className="flex items-center gap-2 mt-4 mb-6">
        <Button
          onClick={() => setActiveTab("boxes")}
          size="sm"
          className={`rounded-full ${
            activeTab === "boxes" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          BOXES
        </Button>
        <Button
          onClick={() => setActiveTab("ambassadors")}
          size="sm"
          className={`rounded-full ${
            activeTab === "ambassadors" ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          AMBASSADORS
        </Button>
      </div>

      {activeTab === "boxes" && (
        <div className="space-y-4">
          {trendingBoxes.map((box) => (
            <TrendingBoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
      {activeTab === "ambassadors" && (
        <div className="space-y-4">
          {trendingAmbassadors.map((ambassador) => (
            <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
          ))}
        </div>
      )}
    </aside>
  )
}
