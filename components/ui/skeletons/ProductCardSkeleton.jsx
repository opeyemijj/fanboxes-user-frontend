import { Skeleton } from "@/components/ui/skeleton"

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden group">
      <div className="relative bg-gray-100 p-4 aspect-square">
        <Skeleton className="w-full h-full rounded" />
        <div className="absolute top-2 left-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
