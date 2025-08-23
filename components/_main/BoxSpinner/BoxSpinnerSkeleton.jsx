export default function BoxSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Ambassador Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-32 bg-gray-200 rounded-full" />
          <div className="h-10 w-32 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Spinning Area Skeleton */}
      <div className="relative w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg mb-8">
        <div className="flex flex-wrap items-center justify-center gap-6 max-w-6xl mx-auto px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Prize Popup Placeholder */}
      <div className="h-24 w-full bg-gray-100 rounded-lg" />
    </div>
  );
}
