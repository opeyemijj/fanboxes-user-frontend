import Image from "next/image"
import { Button } from "@/components/Button"
import { ArrowRight } from "lucide-react"

export default function ProductCard({ item }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden group">
      <div className="relative bg-gray-100 p-4 aspect-square flex items-center justify-center">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={200}
          height={200}
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-gray-900/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
          ${item.price.toLocaleString()}
        </div>
        <Button className="absolute bottom-4 right-4 bg-black text-white rounded-full h-10 w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Buy Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-bold">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.brand}</p>
      </div>
    </div>
  )
}

export { ProductCard }
