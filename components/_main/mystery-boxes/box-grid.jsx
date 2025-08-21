import { allBoxesData } from "@/lib/data-v3"
import { MysteryBoxCard } from "@/components/_main/MysteryBoxCard"

export default function BoxGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">All boxes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allBoxesData.map((box) => (
          <MysteryBoxCard key={box.id} box={box} />
        ))}
      </div>
    </section>
  )
}
