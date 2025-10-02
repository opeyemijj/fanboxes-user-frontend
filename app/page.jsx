// "use client";
// import { useState, useEffect } from "react";
// import Header from "@/components/_main/Header";
// import HeroCarousel from "@/components/_main/HeroCarousel";
// import LatestBoxes from "@/components/_main/LatestBoxes";
// import NewAmbassadors from "@/components/_main/NewAmbassadors";
// import Categories from "@/components/_main/Categories";
// import TrendingSidebar from "@/components/_main/TrendingSidebar";
// import TrendingSidebarSkeleton from "@/components/ui/skeletons/TrendingSidebarSkeleton";
// import Footer from "@/components/_main/Footer";
// import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
// import { useInitialDataFetch } from "@/hooks/useInitialDataFetch";

// export default function HomePage() {
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [isClient, setIsClient] = useState(false);

//   const { isLoading } = useProgressiveLoading(
//     ["hero", "latestBoxes", "newAmbassadors", "trending"],
//     800
//   );

//   const {
//     isLoading: dataLoading,
//     hasError,
//     products,
//     shops,
//   } = useInitialDataFetch();

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   // Show loading state during SSR and initial client render
//   if (typeof window === "undefined" || !isClient) {
//     return (
//       <div className="bg-white text-black">
//         <Header />
//         <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
//           <div className="flex items-center justify-center h-64">
//             <div className="flex flex-col items-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB]"></div>
//               <p className="mt-4 text-lg">Loading...</p>
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
//         {dataLoading && (
//           <div className="text-center py-8">
//             <div className="flex justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11F2EB]"></div>
//             </div>
//             <p className="mt-2">Loading...</p>
//           </div>
//         )}

//         {hasError && (
//           <div className="text-center py-8 text-red-600">
//             <p>Error loading data. Please refresh the page.</p>
//           </div>
//         )}

//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="w-full lg:w-2/3 xl:w-3/4">
//             <HeroCarousel loading={isLoading("hero")} />
//             <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6 mt-6">
//               <LatestBoxes
//                 loading={isLoading("latestBoxes")}
//                 products={products?.products}
//                 error={hasError}
//               />
//             </div>
//             <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6">
//               <NewAmbassadors
//                 shops={shops?.shops}
//                 error={hasError}
//                 loading={isLoading("newAmbassadors")}
//               />
//             </div>
//             <h2 className="text-3xl font-bold mb-4"> Our Categories</h2>
//             <Categories
//               selectedCategory={selectedCategory}
//               onCategoryChange={setSelectedCategory}
//             />
//           </div>

//           <div className="w-full lg:w-1/3 xl:w-1/4">
//             {products?.products && shops?.shops ? (
//               <TrendingSidebar
//                 products={products?.products}
//                 shops={shops?.shops}
//                 loading={isLoading("trending")}
//               />
//             ) : (
//               <></>
//             )}

//             {isLoading("trending") ? <TrendingSidebarSkeleton /> : <></>}
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/_main/Header";
import HeroCarousel from "@/components/_main/HeroCarousel";
import LatestBoxes from "@/components/_main/LatestBoxes";
import NewAmbassadors from "@/components/_main/NewAmbassadors";
import Categories from "@/components/_main/Categories";
import TrendingSidebar from "@/components/_main/TrendingSidebar";
import TrendingSidebarSkeleton from "@/components/ui/skeletons/TrendingSidebarSkeleton";
import Footer from "@/components/_main/Footer";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import { useInitialDataFetch } from "@/hooks/useInitialDataFetch";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const isFirstRender = useRef(true);
  const router = useRouter();

  const { isLoading } = useProgressiveLoading(
    ["hero", "latestBoxes", "newAmbassadors", "trending"],
    800
  );

  const {
    isLoading: dataLoading,
    hasError,
    products,
    shops,
  } = useInitialDataFetch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only route if category is not "all"
    if (selectedCategory !== "all") {
      router.push(`/ambassadors?category=${selectedCategory}`);
    }
  }, [selectedCategory, router]);

  // Show loading state during SSR and initial client render
  if (typeof window === "undefined" || !isClient) {
    return (
      <div className="bg-white text-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB]"></div>
              <p className="mt-4 text-lg">Loading...</p>
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
        {dataLoading && (
          <div className="text-center py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11F2EB]"></div>
            </div>
            <p className="mt-2">Loading...</p>
          </div>
        )}

        {hasError && (
          <div className="text-center py-8 text-red-600">
            <p>Error loading data. Please refresh the page.</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <HeroCarousel loading={isLoading("hero")} />
            <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6 mt-6">
              <LatestBoxes
                loading={isLoading("latestBoxes")}
                products={products?.products}
                error={hasError}
              />
            </div>
            <div className="bg-[#EFEFEF] rounded-lg p-4 mb-6">
              <NewAmbassadors
                shops={shops?.shops}
                error={hasError}
                loading={isLoading("newAmbassadors")}
              />
            </div>
            <h2 className="text-3xl font-bold mb-4"> Our Categories</h2>
            <Categories
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectType="name"
              includeAll={false}
            />
          </div>

          <div className="w-full lg:w-1/3 xl:w-1/4">
            {products?.products && shops?.shops ? (
              <TrendingSidebar
                products={products?.products}
                shops={shops?.shops}
                loading={isLoading("trending")}
              />
            ) : (
              <></>
            )}

            {isLoading("trending") ? <TrendingSidebarSkeleton /> : <></>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
