"use client";

import { Input } from "@/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Search } from "lucide-react";

export default function FilterSidebar({
  searchTerm = "",
  onSearchChange = () => {},
  sortBy = "most-popular",
  onSortChange = () => {},
}) {
  return (
    <aside className=" top-24 space-y-6">
      <div>
        <div className="relative">
          <Input
            placeholder="Search boxes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 bg-gray-50"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-500 mb-2 block">
          SORT BY
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="filter-select w-full bg-gray-50 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem
              value="most-popular"
              className="hover:bg-[#11F2EB]/10 focus:bg-[#11F2EB]/10 cursor-pointer"
            >
              MOST POPULAR
            </SelectItem>
            <SelectItem
              value="newest"
              className="hover:bg-[#11F2EB]/10 focus:bg-[#11F2EB]/10 cursor-pointer"
            >
              NEWEST
            </SelectItem>
            <SelectItem
              value="alphabetical"
              className="hover:bg-[#11F2EB]/10 focus:bg-[#11F2EB]/10 cursor-pointer"
            >
              ALPHABETICAL
            </SelectItem>
            <SelectItem
              value="category"
              className="hover:bg-[#11F2EB]/10 focus:bg-[#11F2EB]/10 cursor-pointer"
            >
              BY CATEGORY
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Filters */}
      {/* <div>
        <label className="text-sm font-semibold text-gray-500 mb-2 block">PRICE RANGE</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input placeholder="Min" className="bg-gray-50 text-sm" />
            <span className="text-gray-400">-</span>
            <Input placeholder="Max" className="bg-gray-50 text-sm" />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-500 mb-2 block">RARITY</label>
        <div className="space-y-2">
          {["Common", "Rare", "Epic", "Legendary"].map((rarity) => (
            <label key={rarity} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-700">{rarity}</span>
            </label>
          ))}
        </div>
      </div> */}
    </aside>
  );
}
