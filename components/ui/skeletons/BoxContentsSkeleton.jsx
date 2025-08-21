import ProductCardSkeleton from "./ProductCardSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function BoxContentsSkeleton({ count = 8 }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <section className="bg-[#EFEFEF] py-8 rounded-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-48 mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
