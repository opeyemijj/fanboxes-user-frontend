import { Skeleton } from "@/components/ui/skeleton"

export default function TrendingBoxCardSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg">
      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
