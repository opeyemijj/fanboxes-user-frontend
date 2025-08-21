import AmbassadorCardSkeleton from "./AmbassadorCardSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewAmbassadorsSkeleton() {
  return (
    <section className="mt-2">
      <Skeleton className="h-9 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <AmbassadorCardSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}
