"use client";
import { useSelector, useDispatch } from "react-redux";
import BoxCard from "@/components/_main/BoxCard";
import LatestBoxesSkeleton from "@/components/ui/skeletons/LatestBoxesSkeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { fetchProducts } from "@/redux/slices/product";
import { setProducts } from "@/redux/slices/product";
import { useEffect, useState } from "react";
import { getAdminOwnedProducts } from "@/services/boxes";

export default function LatestBoxes() {
  const [adminBoxes, setAdminBoxes] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAdminProducts() {
    setLoadingState(true);
    setError(null);
    const response = await getAdminOwnedProducts().catch((err) => {
      console.error("Error fetching admin products:", err);
      setError("Failed to load latest boxes. Please reload the page.");
      setLoadingState(false);
    });
    if (response?.success && Array.isArray(response.data)) {
      setAdminBoxes(response.data);
      setLoadingState(false);
    } else {
      console.error("Failed to fetch admin products or invalid data format");
      setLoadingState(false);
      setError("Failed to load latest boxes. Please reload the page.");
    }
  }

  useEffect(() => {
    //fetch admin owned products
    fetchAdminProducts();
  }, []);

  if (error) {
    return (
      <section>
        <h2 className="text-3xl font-bold mb-6">Latest boxes</h2>
        <ErrorDisplay error={error} onRetry={() => fetchAdminProducts()} />
      </section>
    );
  }

  if (loadingState) {
    return <LatestBoxesSkeleton />;
  }

  // const latestBoxes = products.slice(0, 9);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Latest boxes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {adminBoxes?.length ? (
          [...adminBoxes]
            .slice(0, 9)
            .map((box) => <BoxCard key={box._id} box={box} isNew={true} />)
        ) : (
          <>
            <h6 className="text-1xl text-gray-500 mb-2">
              There are no boxes available for now
            </h6>
          </>
        )}
      </div>
    </section>
  );
}
