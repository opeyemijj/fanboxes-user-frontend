import Header from "@/components/_main/Header";
import BoxSpinner from "@/components/_main/BoxSpinner";
import BoxContents from "@/components/_main/BoxContents";
import YouMightLike from "@/components/_main/YouMightLike";
import Footer from "@/components/_main/Footer";
import { boxesData } from "@/lib/boxes-data";
import { notFound } from "next/navigation";

export default function BoxSpinPage({ params }) {
  const box = boxesData.find((b) => b.slug === params.slug);

  if (!box) {
    notFound();
  }

  return (
    <div className="bg-white text-black">
      <Header />
      <main className="pt-20">
        <BoxSpinner box={box} />
        <BoxContents box={box} />
        <YouMightLike />
      </main>
      <Footer />
    </div>
  );
}
