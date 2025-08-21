import AmbassadorCard from "@/components/_main/AmbassadorCard"

export default function AmbassadorGrid({ ambassadors }) {
  if (ambassadors.length === 0) {
    return (
      <section>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No ambassadors found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
        {ambassadors.map((ambassador) => (
          <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
        ))}
      </div>
    </section>
  )
}
