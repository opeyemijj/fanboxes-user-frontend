import { Skeleton } from "@/components/ui/skeleton"

export default function BoxCardSkeleton() {
  return (
    <div className="group">
      <div className="relative rounded-lg overflow-hidden aspect-video">
        <Skeleton className="w-full h-full bg-gray-400" />
        <div className="absolute bottom-3 right-3 bg-gray-400">
          <Skeleton className="h-8 w-20 rounded-full bg-gray-400" />
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <Skeleton className="h-4 w-3/4 bg-gray-400" />
        <Skeleton className="h-3 w-1/2 bg-gray-400" />
      </div>
    </div>
  )
}
