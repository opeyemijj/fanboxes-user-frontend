import { Skeleton } from "@/components/ui/skeleton"

export default function TrendingBoxCardSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-2 rounded-lg ">
      <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0 bg-gray-300" />
      <div className="flex-1 space-y-2 ">
        <Skeleton className="h-3 w-full bg-gray-300" />
        <Skeleton className="h-3 w-2/3 bg-gray-300" />
      </div>
    </div>
  )
}
