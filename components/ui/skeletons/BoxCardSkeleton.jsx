import { Skeleton } from "@/components/ui/skeleton"

export default function BoxCardSkeleton() {
  return (
    <div className="group">
      <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-3 right-3">
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
