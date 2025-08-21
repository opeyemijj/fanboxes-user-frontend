import { Skeleton } from "@/components/ui/skeleton"

export default function AmbassadorCardSkeleton() {
  return (
    <div className="group block">
      <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-[3/2]">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>
      <div className="mt-3">
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
