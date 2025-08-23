"use client";
import Header from "@/components/_main/Header";
import BoxSpinner from "@/components/_main/BoxSpinner";
import BoxContents from "@/components/_main/BoxContents";
import YouMightLike from "@/components/_main/YouMightLike";
import Footer from "@/components/_main/Footer";
import { boxesData } from "@/lib/boxes-data";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";
import { getProductDetails } from "@/services";
import { useEffect, useState } from "react";
import BoxSpinnerSkeleton from "@/components/_main/BoxSpinner/BoxSpinnerSkeleton";

export default function BoxSpinPage({ params }) {
  const [box, setBox] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  useEffect(() => {
    async function callingProductApi() {
      setApiLoading(true);
      const apiData = await getProductDetails(params.slug);
      if (apiData?.success) {
        setBox(apiData?.data);
        setApiLoading(false);
      } else {
        setBox(null);
        setApiLoading(false);
      }
      console.log(apiData, "Getting products from api", params);
    }
    callingProductApi();
  }, []);

  if (apiLoading) {
    return (
      <div className="bg-white text-black min-h-screen">
        <Header />
        <main className="pt-20">
          <BoxSpinnerSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white text-black">
      <Header />
      {box && (
        <main className="pt-20">
          <BoxSpinner box={box} />
          <BoxContents box={box} />
          {/* <YouMightLike /> */}
        </main>
      )}
      <Footer />
    </div>
  );
}
