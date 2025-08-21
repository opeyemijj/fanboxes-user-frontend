import AmbassadorCard from "@/components/_main/AmbassadorCard"
import { newAmbassadors } from "@/lib/data-v2"

export default function NewAmbassadors() {
  return (
    <section className="mt-2">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">New ambassadors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {newAmbassadors.map((ambassador) => (
          <AmbassadorCard key={ambassador.id} ambassador={ambassador} />
        ))}
      </div>
    </section>
  )
}
