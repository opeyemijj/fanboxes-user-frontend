// =============================================================================
// CLIENT COMPONENT (app/ambassador/[slug]/AmbassadorPageClient.jsx)
// =============================================================================

"use client";
// import Header from "@/components/_main/Header";
import AmbassadorProfile from "@/components/_main/AmbassadorProfile";
import AmbassadorBoxes from "@/components/_main/AmbassadorBoxes";
import AmbassadorTopSidebar from "@/components/_main/AmbassadorTopSidebar";
import YouMightLike from "@/components/_main/YouMightLike";
// import Footer from "@/components/_main/Footer";
import { filterBoxesByCreator } from "@/lib/enhanced-data";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { incrementVisitCount } from "@/services/influencer/index";
import { fetchShops } from "@/redux/slices/shops";
import { fetchCategories } from "@/redux/slices/categories";
import { fetchProducts } from "@/redux/slices/product";

export default function AmbassadorPageClient({ params, initialAmbassador }) {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  // Use initialAmbassador from server as fallback
  const [currentAmbassador, setCurrentAmbassador] = useState(initialAmbassador);

  const { shops, loading: shopsLoading } = useSelector((state) => state.shops);
  const user = useSelector((state) => state?.user?.user || null);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch data on component mount (for Redux state)
  useEffect(() => {
    dispatch(fetchShops());
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Update ambassador from Redux once loaded
  useEffect(() => {
    if (shops?.length) {
      const reduxAmbassador = shops.find((amb) => amb?.slug === params?.slug);
      if (reduxAmbassador) {
        setCurrentAmbassador(reduxAmbassador);
      }
    }
  }, [shops, params?.slug]);

  // Increment visit count
  useEffect(() => {
    if (currentAmbassador && params?.slug) {
      try {
        incrementVisitCount(params.slug);
      } catch (error) {
        console.error(error);
      }
    }
  }, [currentAmbassador?._id, params?.slug]);

  // Show loading only during client hydration
  if (!isClient) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#11F2EB" }}
          ></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // We always have currentAmbassador (from server or Redux)
  const ambassadorBoxes = filterBoxesByCreator(products, currentAmbassador);

  return (
    <div className="bg-white text-black">
      {/* <Header /> */}
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-[300px] bg-gradient-to-r from-yellow-400 to-orange-400 overflow-hidden rounded-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentAmbassador?.cover?.url})`,
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <AmbassadorProfile
                ambassador={currentAmbassador}
                userId={user?._id}
              />
              {currentAmbassador && ambassadorBoxes?.length > 0 && (
                <AmbassadorBoxes
                  ambassador={currentAmbassador}
                  boxes={ambassadorBoxes}
                />
              )}
            </div>
            <div className="w-full lg:w-1/3 xl:w-1/4">
              {currentAmbassador && ambassadorBoxes?.length > 0 && (
                <AmbassadorTopSidebar
                  ambassador={currentAmbassador}
                  boxes={ambassadorBoxes}
                />
              )}
            </div>
          </div>
        </div>
        <YouMightLike />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
