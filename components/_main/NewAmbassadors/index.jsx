"use client";
import { useSelector, useDispatch } from "react-redux";
import AmbassadorCard from "@/components/_main/AmbassadorCard";
import NewAmbassadorsSkeleton from "@/components/ui/skeletons/NewAmbassadorsSkeleton";
import ErrorDisplay from "@/components/ui/ErrorDisplay";
import { fetchShops } from "@/redux/slices/shops";

export default function NewAmbassadors({ loading = false, shops = [], error }) {
  const dispatch = useDispatch();
  // const {
  //   shops = [],
  //   loading: shopsLoading,
  //   error = null,
  // } = useSelector((state) => state.shops);

  if (error) {
    return (
      <section className="mt-2">
        <h2 className="text-3xl font-bold mb-6">New ambassadors</h2>
        <ErrorDisplay error={error} onRetry={() => dispatch(fetchShops())} />
      </section>
    );
  }

  if (loading) {
    return <NewAmbassadorsSkeleton />;
  }

  // Ensure shops is always an array
  const newAmbassadors = Array.isArray(shops) ? shops : [];

  return (
    <section className="mt-2">
      <h2 className="text-3xl font-bold mb-6">New ambassadors</h2>
      <div
        className="
          flex gap-6 overflow-x-auto pb-4
          snap-x snap-mandatory scroll-smooth
          [&::-webkit-scrollbar]:hidden
        "
      >
        {newAmbassadors.length > 0 ? (
          newAmbassadors.map((ambassador) => (
            <div
              key={ambassador._id}
              className="snap-center shrink-0 w-72 sm:w-80"
            >
              <AmbassadorCard ambassador={ambassador} isNew={true} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No ambassadors available</p>
        )}
      </div>
    </section>
  );
}
