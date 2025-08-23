import { Skeleton } from "@/components/ui/skeleton"

export default function AmbassadorCardSkeleton() {
  return (
    <div className="group block">
      <div className="relative rounded-lg overflow-hidden aspect-[3/2]">
        <Skeleton className="w-full h-full bg-gray-400" />
        <div className="absolute top-3 left-3 bg-gray-400">
          <Skeleton className="h-6 w-12 rounded-full bg-gray-400" />
        </div>
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-10 w-20 rounded-full bg-gray-400" />
        </div>
      </div>
      <div className="mt-3">
        <Skeleton className="h-4 w-2/3 bg-gray-400" />
      </div>
    </div>
  )
}
