"use client"
import { useSelector, useDispatch } from "react-redux"
import AmbassadorCard from "@/components/_main/AmbassadorCard"
import NewAmbassadorsSkeleton from "@/components/ui/skeletons/NewAmbassadorsSkeleton"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import { fetchShops } from "@/redux/slices/shops"

export default function NewAmbassadors({ loading = false }) {
  const dispatch = useDispatch()
  const { shops, loading: shopsLoading, error } = useSelector((state) => state.shops)

  if (error) {
    return (
      <section className="mt-2">
        <h2 className="text-3xl font-bold mb-6">New ambassadors</h2>
        <ErrorDisplay error={error} onRetry={() => dispatch(fetchShops())} />
      </section>
    )
  }

  if (loading || shopsLoading) {
    return <NewAmbassadorsSkeleton />
  }

  const newAmbassadors = shops.slice(0, 6)

  return (
    <section className="mt-2">
      <h2 className="text-3xl font-bold mb-6">New ambassadors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {newAmbassadors.map((ambassador) => (
          <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
        ))}
      </div>
    </section>
  )
}
