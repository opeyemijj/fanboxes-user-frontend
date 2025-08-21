import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function FilterSidebar() {
  return (
    <aside className="sticky top-24 space-y-6">
      <div>
        <div className="relative">
          <Input placeholder="Search" className="pr-10 bg-gray-50" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-500">SORT BY</label>
        <Select defaultValue="most-popular">
          <SelectTrigger className="w-full mt-1 bg-gray-50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            <SelectItem value="price-high-low">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  )
}
