import BoxCard from "@/components/_main/BoxCard"
import { recommendedBoxes } from "@/lib/data"

export default function YouMightLike() {
  return (
    <section className="py-4 rounded-xl" style={{ backgroundColor: "#EFEFEF" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-5">You might also like...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedBoxes.slice(0, 4).map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      </div>
    </section>
  )
}
