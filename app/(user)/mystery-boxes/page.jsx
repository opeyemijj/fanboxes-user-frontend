// "use client";
// import { useState, useEffect } from "react";
// import Header from "@/components/_main/Header";
// import FilterSidebar from "@/components/_main/FilterSidebar";
// import BoxGrid from "@/components/_main/BoxGrid";
// import Footer from "@/components/_main/Footer";
// import { getAdminOwnedProducts } from "@/services/boxes";
// import BoxCategories from "@/components/_main/Categories/BoxCategories";
// import { useSelector } from "react-redux";

// export default function MysteryBoxesPage() {
//   const reduxCategories = useSelector(
//     (state) => state?.categories?.categories || []
//   );
//   console.log(reduxCategories, "Check the categories from redux");

//   // Enhanced data (if available)
//   const [enhancedData, setEnhancedData] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("most-popular");

//   // API data states
//   const [adminBoxes, setAdminBoxes] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(2);
//   const [totalItems, setTotalItems] = useState(0);

//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   // useEffect(() => {
//   //   try {
//   //     const enhancedData = require("@/lib/enhanced-data");
//   //     setEnhancedData(enhancedData);
//   //   } catch (error) {
//   //     console.warn("Enhanced data not available");
//   //     setEnhancedData(null);
//   //   }
//   // }, []);

//   async function fetchAdminProducts(page = 1) {
//     console.log("Starting fetchAdminProducts...");
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await getAdminOwnedProducts({
//         page,
//         limit: itemsPerPage,
//         category: selectedCategory,
//         search: searchTerm,
//         sortBy: sortBy,
//       });

//       console.log("API Response:", response);

//       if (response?.success) {
//         console.log("Setting admin boxes:", response.data);
//         setAdminBoxes(response.data || []);
//         setTotalItems(response.total || 0);
//       } else {
//         console.error(
//           "Failed to fetch admin products or invalid data format:",
//           response
//         );
//         setError("Failed to load mystery boxes. Please reload the page.");
//       }
//     } catch (err) {
//       console.error("Error fetching admin products:", err);
//       setError("Failed to load mystery boxes. Please reload the page.");
//     }

//     console.log("Setting loading to false");
//     setIsLoading(false);
//   }

//   useEffect(() => {
//     fetchAdminProducts(currentPage);
//   }, [currentPage, selectedCategory, searchTerm, sortBy]);

//   // Handle page change
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedCategory, searchTerm, sortBy]);

//   // const categories = enhancedData?.categories || [
//   //   { id: "all", name: "All" },
//   //   { id: "tech", name: "Tech" },
//   //   { id: "gaming", name: "Gaming" },
//   //   { id: "beauty", name: "Beauty" },
//   //   { id: "lifestyle", name: "Lifestyle" },
//   //   { id: "fitness", name: "Fitness" },
//   //   { id: "sports", name: "Sports" },
//   // ];

//   // Skeleton Loader Component
//   const SkeletonLoader = () => (
//     <div className="bg-[#EFEFEF] rounded-lg p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {Array.from({ length: 8 }).map((_, index) => (
//           <div key={index} className="group animate-pulse">
//             <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-300 flex items-center justify-center">
//               <div className="w-full h-full bg-gray-400"></div>
//               {/* NEW badge skeleton */}
//               <div className="absolute top-3 left-3 bg-gray-500 h-6 w-12 rounded-full"></div>
//               {/* VIEW button skeleton */}
//               <div className="absolute bottom-3 right-3 bg-gray-500 h-8 w-20 rounded-full"></div>
//             </div>
//             <div className="mt-2">
//               <div className="h-5 bg-gray-400 rounded w-3/4 mb-1"></div>
//               <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // Show error state if API call failed
//   if (error) {
//     return (
//       <div className="bg-white text-black">
//         <Header />
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center text-center">
//               <div className="text-red-500 text-6xl mb-4">⚠️</div>
//               <h2 className="text-2xl font-bold text-red-600 mb-2">
//                 Something went wrong
//               </h2>
//               <p className="text-lg text-gray-600 mb-4">{error}</p>
//               <button
//                 onClick={() => fetchAdminProducts(currentPage)}
//                 className="px-6 py-3 bg-[#11F2EB] text-black rounded-lg hover:bg-opacity-80 transition-colors font-medium"
//               >
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   // Show empty state if no data
//   if (!isLoading && adminBoxes.length === 0) {
//     return (
//       <div className="bg-white text-black">
//         <Header />
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center text-center">
//               <div className="text-gray-400 text-6xl mb-4">📦</div>
//               <h2 className="text-2xl font-bold text-gray-600 mb-2">
//                 No mystery boxes found
//               </h2>
//               <p className="text-lg text-gray-500 mb-4">
//                 There are currently no mystery boxes available.
//               </p>
//               <button
//                 onClick={() => fetchAdminProducts(1)}
//                 className="px-6 py-3 bg-[#11F2EB] text-black rounded-lg hover:bg-opacity-80 transition-colors font-medium"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white text-black">
//       <Header />
//       <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
//         <div className="flex flex-col lg:flex-row gap-8 mt-8">
//           <div className="w-full lg:w-3/3 xl:w-4/4">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//               <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold">
//                 Mystery boxes
//               </h1>
//               <div className="text-sm text-gray-500">
//                 {totalItems} box
//                 {totalItems !== 1 ? "s" : ""} found
//               </div>
//             </div>

//             <div className="mb-8 flex flex-col lg:flex-row gap-8">
//               <div className="w-full lg:w-2/3 xl:w-3/4">
//                 <BoxCategories
//                   categories={reduxCategories}
//                   selectedCategory={selectedCategory}
//                   onCategoryChange={setSelectedCategory}
//                 />
//               </div>

//               <div className="w-full lg:w-1/3 xl:w-1/4 ml-auto">
//                 <FilterSidebar
//                   searchTerm={searchTerm}
//                   onSearchChange={setSearchTerm}
//                   sortBy={sortBy}
//                   onSortChange={setSortBy}
//                   selectedCategory={selectedCategory}
//                   onCategoryChange={setSelectedCategory}
//                 />
//               </div>
//             </div>

//             {/* <div className="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//               <div className="lg:w-80 flex-shrink-0 ml-auto">
//                 <FilterSidebar
//                   searchTerm={searchTerm}
//                   onSearchChange={setSearchTerm}
//                   sortBy={sortBy}
//                   onSortChange={setSortBy}
//                   selectedCategory={selectedCategory}
//                   onCategoryChange={setSelectedCategory}
//                 />
//               </div>
//             </div> */}

//             {isLoading ? (
//               <SkeletonLoader />
//             ) : (
//               <div className="bg-[#EFEFEF] rounded-lg p-6">
//                 <BoxGrid boxes={adminBoxes} />
//               </div>
//             )}

//             {/* Pagination Component */}
//             {totalPages > 1 && (
//               <div className="mt-8 flex items-center justify-center">
//                 <div className="flex items-center space-x-2">
//                   {/* Previous Button */}
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1 || isLoading}
//                     className={`px-3 py-2 rounded-lg font-medium transition-colors ${
//                       currentPage === 1 || isLoading
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-white text-gray-700 hover:bg-gray-600 hover:text-white border border-gray-300"
//                     }`}
//                   >
//                     Previous
//                   </button>

//                   {/* Page Numbers */}
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNumber;
//                     if (totalPages <= 5) {
//                       pageNumber = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNumber = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNumber = totalPages - 4 + i;
//                     } else {
//                       pageNumber = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => handlePageChange(pageNumber)}
//                         disabled={isLoading}
//                         className={`px-3 py-2 rounded-lg font-medium transition-colors ${
//                           currentPage === pageNumber
//                             ? "bg-gray-700 text-white"
//                             : "bg-white text-gray-700 hover:bg-gray-600 hover:text-white border border-gray-300"
//                         } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   })}

//                   {/* Show ellipsis and last page if needed */}
//                   {totalPages > 5 && currentPage < totalPages - 2 && (
//                     <>
//                       <span className="px-2 text-gray-500">...</span>
//                       <button
//                         onClick={() => handlePageChange(totalPages)}
//                         disabled={isLoading}
//                         className={`px-3 py-2 rounded-lg font-medium bg-gray-700 text-white hover:bg-gray-600 hover:text-white border border-gray-300 transition-colors ${
//                           isLoading ? "opacity-50 cursor-not-allowed" : ""
//                         }`}
//                       >
//                         {totalPages}
//                       </button>
//                     </>
//                   )}

//                   {/* Next Button */}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages || isLoading}
//                     className={`px-3 py-2 rounded-lg font-medium transition-colors ${
//                       currentPage === totalPages || isLoading
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-white text-gray-700 hover:bg-gray-600 hover:text-white border border-gray-300"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Pagination Info */}
//             {totalItems > 0 && (
//               <div className="mt-4 text-center text-sm text-gray-500">
//                 Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                 {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
//                 {totalItems} results
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import Header from "@/components/_main/Header";
import FilterSidebar from "@/components/_main/FilterSidebar";
import BoxGrid from "@/components/_main/BoxGrid";
import Footer from "@/components/_main/Footer";
import { getAdminOwnedProducts } from "@/services/boxes";
import BoxCategories from "@/components/_main/Categories/BoxCategories";
import { useSelector } from "react-redux";

export default function MysteryBoxesPage() {
  const reduxCategories = useSelector(
    (state) => state?.categories?.categories || []
  );

  // State for client-side hydration check
  const [isClient, setIsClient] = useState(false);

  // Enhanced data (if available)
  const [enhancedData, setEnhancedData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");

  // API data states
  const [adminBoxes, setAdminBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fix hydration issue by ensuring component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  async function fetchAdminProducts(page = 1) {
    console.log("Starting fetchAdminProducts...");
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminOwnedProducts({
        page,
        limit: itemsPerPage,
        // Pass the actual category ID, or undefined/null for "all"
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchTerm,
        sortBy: sortBy,
      });

      console.log("API Response:", response);

      if (response?.success) {
        console.log("Setting admin boxes:", response.data);
        setAdminBoxes(response.data || []);
        setTotalItems(response.total || 0);
      } else {
        console.error(
          "Failed to fetch admin products or invalid data format:",
          response
        );
        setError("Failed to load mystery boxes. Please reload the page.");
      }
    } catch (err) {
      console.error("Error fetching admin products:", err);
      setError("Failed to load mystery boxes. Please reload the page.");
    }

    console.log("Setting loading to false");
    setIsLoading(false);
  }

  useEffect(() => {
    if (isClient) {
      fetchAdminProducts(currentPage);
    }
  }, [currentPage, selectedCategory, searchTerm, sortBy, isClient]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="bg-[#EFEFEF] rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="group animate-pulse">
            <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-300 flex items-center justify-center">
              <div className="w-full h-full bg-gray-400"></div>
              {/* NEW badge skeleton */}
              <div className="absolute top-3 left-3 bg-gray-500 h-6 w-12 rounded-full"></div>
              {/* VIEW button skeleton */}
              <div className="absolute bottom-3 right-3 bg-gray-500 h-8 w-20 rounded-full"></div>
            </div>
            <div className="mt-2">
              <div className="h-5 bg-gray-400 rounded w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="bg-white text-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <SkeletonLoader />
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state if API call failed
  if (error) {
    return (
      <div className="bg-white text-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Something went wrong
              </h2>
              <p className="text-lg text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => fetchAdminProducts(currentPage)}
                className="px-6 py-3 bg-[#11F2EB] text-black rounded-lg hover:bg-opacity-80 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show empty state if no data
  if (!isLoading && adminBoxes.length === 0) {
    return (
      <div className="bg-white text-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center text-center">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                No mystery boxes found
              </h2>
              <p className="text-lg text-gray-500 mb-4">
                There are currently no mystery boxes available.
              </p>
              <button
                onClick={() => fetchAdminProducts(1)}
                className="px-6 py-3 bg-[#11F2EB] text-black rounded-lg hover:bg-opacity-80 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-3/3 xl:w-4/4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold">
                Mystery boxes
              </h1>
              <div className="text-sm text-gray-500">
                {totalItems} box
                {totalItems !== 1 ? "s" : ""} found
              </div>
            </div>

            <div className="mb-8 flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3 xl:w-3/4">
                <BoxCategories
                  categories={reduxCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              <div className="w-full lg:w-1/3 xl:w-1/4 ml-auto">
                <FilterSidebar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
            </div>

            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <div className="bg-[#EFEFEF] rounded-lg p-6">
                <BoxGrid boxes={adminBoxes} />
              </div>
            )}

            {/* Pagination Component */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === 1 || isLoading
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-600 hover:text-white border border-gray-300"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={isLoading}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === pageNumber
                            ? "bg-gray-700 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-600 hover:text-white border border-gray-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  {/* Show ellipsis and last page if needed */}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={isLoading}
                        className={`px-3 py-2 rounded-lg font-medium bg-gray-700 text-white hover:bg-gray-600 hover:text-white border border-gray-300 transition-colors ${
                          isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages || isLoading
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-600 hover:text-white border border-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Pagination Info */}
            {totalItems > 0 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} results
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
