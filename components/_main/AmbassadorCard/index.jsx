import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/Button"

export default function AmbassadorCard({ ambassador }) {
  if (!ambassador) {
    console.log("[v0] Ambassador card received no data")
    return null
  }

  // Generate slug from name if missing
  const slug =
    ambassador.slug ||
    ambassador.name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") ||
    `ambassador-${ambassador.id}`

  return (
    <Link href={`/ambassadors/${slug}`} className="group block">
      <div className="relative rounded-lg overflow-hidden bg-gray-800 dark:bg-gray-700 aspect-[3/2]">
        <Image
          src={ambassador.image || "/placeholder.svg"}
          alt={ambassador.name || "Ambassador"}
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 " />

        {/* Badge */}
        {ambassador.isNew && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-bold px-2 py-1 rounded-full text-black"
              style={{ backgroundColor: "#11F2EB" }}
            >
              NEW
            </span>
          </div>
        )}

        {/* View Button */}
        <Button className="absolute bottom-4 right-4 bg-black/70 dark:bg-white/90 text-white dark:text-black rounded-full h-10 w-20 opacity-100">
          <span className="flex items-center text-sm">
            VIEW <span className="ml-2">→</span>
          </span>
        </Button>
      </div>
      <p className="font-bold mt-3 text-sm text-black dark:text-white">{ambassador.name || "Unknown Ambassador"}</p>
    </Link>
  )
}
