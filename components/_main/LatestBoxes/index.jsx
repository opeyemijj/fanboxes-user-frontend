"use client";
import { useSelector, useDispatch } from "react-redux";
import BoxCard from "@/components/_main/BoxCard";
import LatestBoxesSkeleton from "@/components/ui/skeletons/LatestBoxesSkeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { fetchProducts } from "@/redux/slices/product";
import { setProducts } from "@/redux/slices/product";

export default function LatestBoxes({ loading = false }) {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error,
  } = useSelector((state) => state.product);

  if (error) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-6">Latest boxes</h2>
        <ErrorDisplay error={error} onRetry={() => dispatch(fetchProducts())} />
      </section>
    );
  }

  if (loading || productsLoading) {
    return <LatestBoxesSkeleton />;
  }

  const latestBoxes = products.slice(0, 9);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Latest boxes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {latestBoxes.map((box) => (
          <BoxCard key={box._id} box={box} isNew={true} />
        ))}
      </div>
    </section>
  );
}
