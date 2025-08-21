import BoxCard from "@/components/_main/BoxCard"
import { ambassadorBoxesData } from "@/lib/ambassadors-data"

export default function AmbassadorBoxes({ ambassador, boxes }) {
  const ambassadorBoxes = boxes || ambassadorBoxesData.filter((box) => box.ambassadorId === ambassador.id)

  return (
    <section className="mb-12 p-6 rounded-lg bg-[#EFEFEF] dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ambassadorBoxes.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </section>
  )
}
