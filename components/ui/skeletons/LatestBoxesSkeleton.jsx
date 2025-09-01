import AmbassadorCardSkeleton from "./AmbassadorCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewAmbassadorsSkeleton() {
  return (
    <section className="mt-2">
      {/* Title Skeleton */}
      <Skeleton className="h-9 w-48 mb-6" />

      {/* Slider Skeleton */}
      <div
        className="
          flex gap-6 overflow-x-auto pb-4
          snap-x snap-mandatory scroll-smooth
          [&::-webkit-scrollbar]:hidden
        "
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="snap-center shrink-0 w-72 sm:w-80">
            <AmbassadorCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
