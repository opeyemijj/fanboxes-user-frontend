// "use client";
// import { useState, useMemo, useEffect, useRef } from "react";
// import Header from "@/components/_main/Header";
// import AmbassadorCategories from "@/components/_main/AmbassadorCategories";
// import AmbassadorGrid from "@/components/_main/AmbassadorGrid";
// import AmbassadorFilterSidebar from "@/components/_main/AmbassadorFilterSidebar";
// import Footer from "@/components/_main/Footer";
// import { useSelector, useDispatch } from "react-redux";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { fetchShops } from "@/redux/slices/shops";
// import { fetchCategories } from "@/redux/slices/categories";
// import { fetchProducts } from "@/redux/slices/product";

// export default function AmbassadorsPage() {
//   const dispatch = useDispatch();

//   // Add hydration state to prevent mismatches
//   const [isHydrated, setIsHydrated] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("most-popular");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 12;

//   // Create a ref for the ambassadors section
//   const ambassadorsSectionRef = useRef(null);

//   const reduxCategories = useSelector(
//     (state) => state?.categories?.categories || []
//   );

//   // Get shops data from Redux
//   const {
//     shops,
//     loading: shopsLoading,
//     error: shopError,
//   } = useSelector((state) => state.shops);

//   // Get products and categories loading states
//   // const {
//   //   products,
//   //   loading: productsLoading,
//   //   error: productsError,
//   // } = useSelector((state) => state.product);

//   // const {
//   //   categories,
//   //   loading: categoriesLoading,
//   //   error: categoriesError,
//   // } = useSelector((state) => state.categories);

//   // useEffect(() => {
//   //   console.log("shps changed::", shops);
//   // }, [shops]);

//   // Fetch data on component mount
//   useEffect(() => {
//     dispatch(fetchShops());
//     dispatch(fetchCategories());
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   // Handle hydration
//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   // Smart scroll to ambassadors section
//   const scrollToAmbassadorsSection = () => {
//     if (ambassadorsSectionRef.current) {
//       const sectionTop = ambassadorsSectionRef.current.offsetTop;
//       const headerOffset = window.innerWidth < 768 ? 100 : 50; // More offset on mobile

//       const scrollPosition = Math.max(0, sectionTop - headerOffset);

//       window.scrollTo({
//         top: scrollPosition,
//         behavior: "smooth",
//       });
//     } else {
//       // Fallback to top of page
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     }
//   };

//   // Filter and sort ambassadors using Redux data only
//   const filteredAmbassadors = useMemo(() => {
//     if (!shops || shops.length === 0) return [];

//     let filtered = [...shops];

//     // Apply category filter - simple implementation for Redux data
//     if (selectedCategory !== "all") {
//       // console.log("shop::", shops);
//       filtered = filtered.filter(
//         (shop) =>
//           shop.category?.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }

//     // Apply search filter - simple implementation for Redux data
//     if (searchTerm.trim()) {
//       const query = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (shop) =>
//           shop?.title?.toLowerCase().includes(query) ||
//           shop?.slug?.toLowerCase().includes(query) ||
//           shop?.category?.toLowerCase().includes(query) ||
//           shop?.description?.toLowerCase().includes(query)
//       );
//     }

//     // Apply sorting
//     switch (sortBy) {
//       case "newest":
//         filtered.sort(
//           (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
//         );
//         break;
//       case "alphabetical":
//         filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
//         break;
//       case "most-visited":
//         filtered.sort((a, b) => (b.visitedCount || 0) - (a.visitedCount || 0));
//         break;
//       case "most-popular":
//       default:
//         // Sort by isFeatured first, then by visitedCount
//         filtered.sort((a, b) => {
//           const aFeatured = a.isFeatured || false;
//           const bFeatured = b.isFeatured || false;

//           if (aFeatured !== bFeatured) {
//             return bFeatured - aFeatured;
//           }

//           return (b.visitedCount || 0) - (a.visitedCount || 0);
//         });
//         break;
//     }

//     return filtered;
//   }, [shops, selectedCategory, searchTerm, sortBy]);

//   // Pagination calculations - will update automatically when filteredAmbassadors changes
//   const totalPages = Math.ceil(filteredAmbassadors.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedAmbassadors = filteredAmbassadors.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   // Reset to first page when filters change
//   const handleFiltersChange = (callback) => {
//     return (...args) => {
//       setCurrentPage(1);
//       callback(...args);
//     };
//   };

//   const handleCategoryChange = (categoryId) => {
//     setCurrentPage(1);
//     // Toggle selection: if same category is clicked again, set to "all"
//     setSelectedCategory((prevCategory) =>
//       prevCategory === categoryId ? "all" : categoryId
//     );
//     scrollToAmbassadorsSection();
//   };

//   // Handle pagination with smart scroll
//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     scrollToAmbassadorsSection();
//   };

//   // Pagination component
//   const Pagination = () => {
//     if (totalPages <= 1) return null;

//     const getVisiblePages = () => {
//       const delta = 2;
//       const range = [];
//       const rangeWithDots = [];

//       for (
//         let i = Math.max(2, currentPage - delta);
//         i <= Math.min(totalPages - 1, currentPage + delta);
//         i++
//       ) {
//         range.push(i);
//       }

//       if (currentPage - delta > 2) {
//         rangeWithDots.push(1, "...");
//       } else {
//         rangeWithDots.push(1);
//       }

//       rangeWithDots.push(...range);

//       if (currentPage + delta < totalPages - 1) {
//         rangeWithDots.push("...", totalPages);
//       } else {
//         rangeWithDots.push(totalPages);
//       }

//       return rangeWithDots;
//     };

//     return (
//       <div className="flex items-center justify-center gap-2 mt-8">
//         <button
//           onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
//           disabled={currentPage === 1}
//           className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           Previous
//         </button>

//         {getVisiblePages().map((page, index) => (
//           <button
//             key={index}
//             onClick={() => typeof page === "number" && handlePageChange(page)}
//             disabled={page === "..."}
//             className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
//               page === currentPage
//                 ? "bg-gray-800 text-white shadow-sm"
//                 : page === "..."
//                 ? "text-gray-400 cursor-default"
//                 : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
//             }`}
//           >
//             {page}
//           </button>
//         ))}

//         <button
//           onClick={() =>
//             handlePageChange(Math.min(totalPages, currentPage + 1))
//           }
//           disabled={currentPage === totalPages}
//           className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//         >
//           Next
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>
//     );
//   };

//   // Show loading only if hydration hasn't occurred AND there's no shops data AND it's loading
//   if (!isHydrated || (!shops?.length && shopsLoading)) {
//     return (
//       <div className="bg-white text-black">
//         <Header />
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center">
//               <div
//                 className="animate-spin rounded-full h-12 w-12 border-b-2"
//                 style={{ borderColor: "#11F2EB" }}
//               ></div>
//               <p className="mt-4 text-lg">Please wait...</p>
//             </div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   // Show error state
//   if (shopError) {
//     return (
//       <div className="bg-white text-black">
//         <Header />
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center">
//               <div className="text-red-500 text-6xl mb-4">⚠️</div>
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                 Error loading ambassadors
//               </h3>
//               <p className="text-gray-500">Please try again later</p>
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
//                 Our ambassadors
//               </h1>
//               <div className="text-sm text-gray-500">
//                 {filteredAmbassadors.length} ambassador
//                 {filteredAmbassadors.length !== 1 ? "s" : ""} found
//                 {filteredAmbassadors.length > itemsPerPage && (
//                   <span className="ml-2">
//                     (Page {currentPage} of {totalPages})
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="mb-8 flex flex-col lg:flex-row gap-8">
//               <div className="w-full lg:w-2/3 xl:w-3/4">
//                 <AmbassadorCategories
//                   categories={reduxCategories}
//                   selectedCategory={selectedCategory}
//                   onCategoryChange={handleCategoryChange}
//                 />
//               </div>

//               <div className="w-full lg:w-1/3 xl:w-1/4">
//                 <AmbassadorFilterSidebar
//                   searchTerm={searchTerm}
//                   onSearchChange={handleFiltersChange(setSearchTerm)}
//                   sortBy={sortBy}
//                   onSortChange={handleFiltersChange(setSortBy)}
//                 />
//               </div>
//             </div>

//             {/* Add ref to the ambassadors section */}
//             <div ref={ambassadorsSectionRef}>
//               <div
//                 className="p-5 rounded-lg mb-4"
//                 style={{ backgroundColor: "#EFEFEF" }}
//               >
//                 <AmbassadorGrid ambassadors={paginatedAmbassadors} />
//               </div>
//             </div>

//             {/* Pagination */}
//             <Pagination />
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/_main/Header";
import AmbassadorCategories from "@/components/_main/AmbassadorCategories";
import AmbassadorGrid from "@/components/_main/AmbassadorGrid";
import AmbassadorFilterSidebar from "@/components/_main/AmbassadorFilterSidebar";
import Footer from "@/components/_main/Footer";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchShops } from "@/redux/slices/shops";
import { fetchCategories } from "@/redux/slices/categories";
import { fetchProducts } from "@/redux/slices/product";
import { useSearchParams } from "next/navigation";

export default function AmbassadorsPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Add hydration state to prevent mismatches
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("most-popular");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Create a ref for the ambassadors section
  const ambassadorsSectionRef = useRef(null);

  const reduxCategories = useSelector(
    (state) => state?.categories?.categories || []
  );

  // Get shops data from Redux
  const {
    shops,
    loading: shopsLoading,
    error: shopError,
  } = useSelector((state) => state.shops);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchShops());
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle hydration and query parameters
  useEffect(() => {
    setIsHydrated(true);

    // Check for category in query string
    const categoryFromQuery = searchParams.get("category");
    if (categoryFromQuery) {
      // Find the category ID by matching name or slug from categoryDetails
      const matchingShop = shops.find(
        (shop) =>
          shop.categoryDetails?.name?.toLowerCase() ===
            categoryFromQuery.toLowerCase() ||
          shop.categoryDetails?.slug?.toLowerCase() ===
            categoryFromQuery.toLowerCase()
      );

      if (matchingShop) {
        setSelectedCategory(matchingShop.category);
      } else {
        // If no match found, try to find in reduxCategories
        const matchingCategory = reduxCategories.find(
          (cat) =>
            cat.name?.toLowerCase() === categoryFromQuery.toLowerCase() ||
            cat.slug?.toLowerCase() === categoryFromQuery.toLowerCase()
        );

        if (matchingCategory) {
          setSelectedCategory(matchingCategory._id);
        }
      }
    }
  }, [searchParams, shops, reduxCategories]);

  // Smart scroll to ambassadors section
  const scrollToAmbassadorsSection = () => {
    if (ambassadorsSectionRef.current) {
      const sectionTop = ambassadorsSectionRef.current.offsetTop;
      const headerOffset = window.innerWidth < 768 ? 100 : 50; // More offset on mobile

      const scrollPosition = Math.max(0, sectionTop - headerOffset);

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    } else {
      // Fallback to top of page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Filter and sort ambassadors using Redux data only
  const filteredAmbassadors = useMemo(() => {
    if (!shops || shops.length === 0) return [];

    let filtered = [...shops];

    // Apply category filter - using shop.category (which is the ID)
    if (selectedCategory !== "all") {
      filtered = filtered.filter((shop) => shop.category === selectedCategory);
    }

    // Apply search filter - simple implementation for Redux data
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (shop) =>
          shop?.title?.toLowerCase().includes(query) ||
          shop?.slug?.toLowerCase().includes(query) ||
          shop?.categoryDetails?.name?.toLowerCase().includes(query) ||
          shop?.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "alphabetical":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "most-visited":
        filtered.sort((a, b) => (b.visitedCount || 0) - (a.visitedCount || 0));
        break;
      case "most-popular":
      default:
        // Sort by isFeatured first, then by visitedCount
        filtered.sort((a, b) => {
          const aFeatured = a.isFeatured || false;
          const bFeatured = b.isFeatured || false;

          if (aFeatured !== bFeatured) {
            return bFeatured - aFeatured;
          }

          return (b.visitedCount || 0) - (a.visitedCount || 0);
        });
        break;
    }

    return filtered;
  }, [shops, selectedCategory, searchTerm, sortBy]);

  // Pagination calculations - will update automatically when filteredAmbassadors changes
  const totalPages = Math.ceil(filteredAmbassadors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAmbassadors = filteredAmbassadors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  const handleFiltersChange = (callback) => {
    return (...args) => {
      setCurrentPage(1);
      callback(...args);
    };
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentPage(1);
    // Toggle selection: if same category is clicked again, set to "all"
    setSelectedCategory((prevCategory) =>
      prevCategory === categoryId ? "all" : categoryId
    );
    scrollToAmbassadorsSection();
  };

  // Handle pagination with smart scroll
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    scrollToAmbassadorsSection();
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              page === currentPage
                ? "bg-gray-800 text-white shadow-sm"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Show loading only if hydration hasn't occurred AND there's no shops data AND it's loading
  if (!isHydrated || (!shops?.length && shopsLoading)) {
    return (
      <div className="bg-white text-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: "#11F2EB" }}
              ></div>
              <p className="mt-4 text-lg">Please wait...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (shopError) {
    return (
      <div className="bg-white text-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Error loading ambassadors
              </h3>
              <p className="text-gray-500">Please try again later</p>
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
                Our ambassadors
              </h1>
              <div className="text-sm text-gray-500">
                {filteredAmbassadors.length} ambassador
                {filteredAmbassadors.length !== 1 ? "s" : ""} found
                {filteredAmbassadors.length > itemsPerPage && (
                  <span className="ml-2">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8 flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3 xl:w-3/4">
                <AmbassadorCategories
                  categories={reduxCategories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>

              <div className="w-full lg:w-1/3 xl:w-1/4">
                <AmbassadorFilterSidebar
                  searchTerm={searchTerm}
                  onSearchChange={handleFiltersChange(setSearchTerm)}
                  sortBy={sortBy}
                  onSortChange={handleFiltersChange(setSortBy)}
                />
              </div>
            </div>

            {/* Add ref to the ambassadors section */}
            <div ref={ambassadorsSectionRef}>
              <div
                className="p-5 rounded-lg mb-4"
                style={{ backgroundColor: "#EFEFEF" }}
              >
                <AmbassadorGrid ambassadors={paginatedAmbassadors} />
              </div>
            </div>

            {/* Pagination */}
            <Pagination />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
