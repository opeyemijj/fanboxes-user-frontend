import BoxCard from "@/components/_main/BoxCard"

export default function AmbassadorTopSidebar({ ambassador }) {
  const topBoxes = [
    {
      id: 1,
      title: "Box Name",
      slug: `${ambassador.slug}-top-box-1`,
      price: "100 ⬡",
      image: "/placeholder.svg?height=150&width=200",
      creator: ambassador.name,
      creatorImage: ambassador.image,
    },
    {
      id: 2,
      title: "Box Name",
      slug: `${ambassador.slug}-top-box-2`,
      price: "100 ⬡",
      image: "/placeholder.svg?height=150&width=200",
      creator: ambassador.name,
      creatorImage: ambassador.image,
    },
    {
      id: 3,
      title: "Box Name",
      slug: `${ambassador.slug}-top-box-3`,
      price: "100 ⬡",
      image: "/placeholder.svg?height=150&width=200",
      creator: ambassador.name,
      creatorImage: ambassador.image,
    },
  ]

  return (
    <aside className="bg-[#EFEFEF] p-6 rounded-lg sticky top-24">
      <h3 className="text-xl font-bold mb-4">{ambassador.name}'s Top 5</h3>
      <div className="space-y-4">
        {topBoxes.map((box) => (
          <BoxCard key={box.id} box={box} />
        ))}
      </div>
    </aside>
  )
}
