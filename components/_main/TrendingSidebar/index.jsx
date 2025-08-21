"use client"

import { useState } from "react"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { Search } from "lucide-react"
import TrendingBoxCard from "@/components/_main/TrendingBoxCard"
import AmbassadorCard from "@/components/_main/AmbassadorCard"
import { trendingBoxes, trendingAmbassadors } from "@/lib/data-v2"

export default function TrendingSidebar() {
  const [activeTab, setActiveTab] = useState("boxes")

  return (
    <aside className="p-6 sticky top-24 rounded-xl bg-[#EFEFEF] dark:bg-gray-800 transition-colors duration-200">
      <div className="relative mb-6">
        <Input placeholder="Search" className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold dark:text-white">Trending</h3>
        <div className="flex items-center gap-1 ml-auto">
          <Button
            onClick={() => setActiveTab("boxes")}
            size="sm"
            className={`rounded text-[10px] px-1.5 py-0.5 transition-colors duration-200 ${
              activeTab === "boxes"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-white dark:bg-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
          >
            BOXES
          </Button>
          <Button
            onClick={() => setActiveTab("ambassadors")}
            size="sm"
            className={`rounded text-[10px] px-1.5 py-0.5 transition-colors duration-200 ${
              activeTab === "ambassadors"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-white dark:bg-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
          >
            AMBASSADORS
          </Button>
        </div>
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
