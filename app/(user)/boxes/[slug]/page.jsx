"use client";
import Header from "@/components/_main/Header";
import BoxSpinner from "@/components/_main/BoxSpinner";
import BoxContents from "@/components/_main/BoxContents";
import YouMightLike from "@/components/_main/YouMightLike";
import Footer from "@/components/_main/Footer";
import { boxesData } from "@/lib/boxes-data";
import { notFound } from "next/navigation";
import { useSelector } from "react-redux";

export default function BoxSpinPage({ params }) {
  const {
    products,
    loading: productsLoading,
    error,
  } = useSelector((state) => state.product);

  // Show loader while fetching
  if (productsLoading) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <p>Loading box...</p>
      </div>
    );
  }

  // Handle fetch error
  if (error) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <p className="text-red-600">Failed to load products: {error}</p>
      </div>
    );
  }

  // Once loaded, find the box by slug
  const box = products.find((b) => b.slug === params.slug);

  if (!box) {
    notFound();
  }

  return (
    <div className="bg-white text-black">
      <Header />
      <main className="pt-20">
        <BoxSpinner box={box} />
        <BoxContents box={box} />
        {/* <YouMightLike /> */}
      </main>
      <Footer />
    </div>
  );
}
