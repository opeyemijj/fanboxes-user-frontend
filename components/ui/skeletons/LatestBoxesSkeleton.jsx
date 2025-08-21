import BoxCardSkeleton from "./BoxCardSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function LatestBoxesSkeleton() {
  return (
    <section>
      <Skeleton className="h-9 w-40 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <BoxCardSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}
