"use client";
import Header from "@/components/_main/Header";
import AmbassadorProfile from "@/components/_main/AmbassadorProfile";
import AmbassadorBoxes from "@/components/_main/AmbassadorBoxes";
import AmbassadorTopSidebar from "@/components/_main/AmbassadorTopSidebar";
import YouMightLike from "@/components/_main/YouMightLike";
import Footer from "@/components/_main/Footer";
import {
  enhancedAmbassadors,
  enhancedMysteryBoxes,
  filterBoxesByCreator,
} from "@/lib/enhanced-data";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";

export default function AmbassadorProfilePage({ params }) {
  const {
    shops,
    loading: shopsLoading,
    error,
  } = useSelector((state) => state.shops);

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.product);
  console.log(shops, "Check the shop");

  const ambassador = shops?.find((amb) => amb?.slug === params?.slug);

  if (!ambassador) {
    notFound();
  }

  // Get ambassador's boxes
  const ambassadorBoxes = filterBoxesByCreator(products, ambassador);
  // console.log(ambassadorBoxes, "check how many box are here");

  return (
    <div className="bg-white text-black">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-[300px] bg-gradient-to-r from-yellow-400 to-orange-400 overflow-hidden rounded-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${ambassador?.cover?.url})`,
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            <div className="w-full lg:w-2/3 xl:w-3/4">
              <AmbassadorProfile ambassador={ambassador} />
              <AmbassadorBoxes
                ambassador={ambassador}
                boxes={ambassadorBoxes}
              />
            </div>
            <div className="w-full lg:w-1/3 xl:w-1/4">
              <AmbassadorTopSidebar
                ambassador={ambassador}
                boxes={ambassadorBoxes}
              />
            </div>
          </div>
        </div>

        {/* <YouMightLike /> */}
      </main>
      <Footer />
    </div>
  );
}
