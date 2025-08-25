export default function BoxSkeleton() {
  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 animate-pulse">
      {/* Ambassador Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-full flex-shrink-0" />
          <div>
            <div className="h-5 sm:h-6 w-32 sm:w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
          <div className="h-8 sm:h-10 w-28 sm:w-32 bg-gray-200 rounded-full" />
          <div className="h-8 sm:h-10 w-28 sm:w-32 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Spinning Area Skeleton */}
      <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[400px] bg-gray-100 flex items-center justify-center rounded-lg mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto px-3 sm:px-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Prize Popup Placeholder */}
      <div className="h-20 sm:h-24 w-full bg-gray-100 rounded-lg" />
    </div>
  );
}
