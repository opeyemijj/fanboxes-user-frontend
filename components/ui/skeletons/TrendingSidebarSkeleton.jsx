import TrendingBoxCardSkeleton from "./TrendingBoxCardSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function TrendingSidebarSkeleton() {
  return (
    <aside className="p-6 sticky top-24 rounded-xl" style={{ backgroundColor: "#EFEFEF" }}>
      {/* Search skeleton */}
      <div className="relative mb-6">
        <Skeleton className="h-10 w-full rounded" />
      </div>

      {/* Header and tabs skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-1 ml-auto">
          <Skeleton className="h-6 w-16 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
        </div>
      </div>

      {/* Trending items skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <TrendingBoxCardSkeleton key={index} />
        ))}
      </div>
    </aside>
  )
}
