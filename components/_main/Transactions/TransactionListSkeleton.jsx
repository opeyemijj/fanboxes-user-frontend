const TransactionsListSkeletonLoader = () => (
  <div className="bg-gray-50 text-black min-h-screen">
    <main className="container mx-auto px-3 sm:px-6 lg:px-8 pt-20 pb-16 flex-grow">
      {/* Transactions List Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2 sm:mb-0"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Transaction Items Skeleton */}
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="px-4 sm:px-6 py-4 border-b border-gray-100"
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              {/* Icon Skeleton */}
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              {/* Content Skeleton */}
              <div className="flex-grow min-w-0">
                <div className="flex flex-col space-y-3">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Middle row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-1 sm:mt-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);

export default TransactionsListSkeletonLoader;
