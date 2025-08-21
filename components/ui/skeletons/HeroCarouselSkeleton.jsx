import { Skeleton } from "@/components/ui/skeleton"

export default function HeroCarouselSkeleton() {
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full" />

      {/* Content overlay skeleton */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-8 md:p-12 max-w-2xl">
        <Skeleton className="h-12 w-80 mb-3" />
        <Skeleton className="h-6 w-96 mb-6" />
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>

      {/* Navigation dots skeleton */}
      <div className="absolute bottom-4 left-8 md:left-12 z-30 flex space-x-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-8 h-1 rounded-full" />
        ))}
      </div>
    </div>
  )
}
