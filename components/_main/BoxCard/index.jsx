import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/Button"

export default function BoxCard({ box }) {
  const boxSlug = box.slug || `${box.title?.toLowerCase().replace(/\s+/g, "-")}-${box.id}` || `box-${box.id}`

  return (
    <div className="group">
      <Link href={`/boxes/${boxSlug}`}>
        <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-100 flex items-center justify-center cursor-pointer">
          <Image src={box.image || "/placeholder.png"} alt={box.title || "Box image"} fill className="object-cover" />
          {box.isNew && (
            <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
              NEW
            </div>
          )}
          <Button className="absolute bottom-3 right-3 bg-black text-white rounded-full h-8 w-20 text-sm flex items-center justify-center">
            VIEW <span className="ml-1">→</span>
          </Button>
        </div>
      </Link>
      <div className="mt-2">
        <span className="font-bold">{box.title}</span>
        {box.creator && <span className="text-sm text-gray-500 ml-2">{box.creator}</span>}
      </div>
    </div>
  )
}
