"use client"

import { Input } from "@/components/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import { Search } from "lucide-react"

export default function AmbassadorFilterSidebar({ searchTerm, onSearchChange, sortBy, onSortChange }) {
  return (
    <aside className="my-8 top-24 space-y-6">
      <div>
        <div className="relative">
          <Input
            placeholder="Search ambassadors..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 bg-gray-50 text-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-500 mb-2 block">SORT BY</label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full bg-gray-50 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-popular">MOST POPULAR</SelectItem>
            <SelectItem value="newest">NEWEST</SelectItem>
            <SelectItem value="alphabetical">ALPHABETICAL</SelectItem>
            <SelectItem value="category">BY CATEGORY</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Filters */}
      {/* <div>
        <label className="text-sm font-semibold text-gray-500 mb-2 block">STATUS</label>
        <div className="space-y-2">
          {["Verified", "New", "Popular"].map((status) => (
            <label key={status} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-500 mb-2 block">FOLLOWERS</label>
        <div className="space-y-2">
          {["1M+", "500K+", "100K+", "50K+"].map((range) => (
            <label key={range} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-700">{range}</span>
            </label>
          ))}
        </div>
      </div> */}
    </aside>
  )
}
