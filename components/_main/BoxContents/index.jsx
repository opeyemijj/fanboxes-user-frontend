import Image from "next/image"
import { Button } from "@/components/Button"

export default function BoxContents({ box }) {
  return (
    <section className="bg-[#EFEFEF] py-8 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">What's in the box...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {box.contents?.map((item) => (
            <div key={item.id} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm aspect-[4/3] relative flex">
                <div className="relative bg-white p-4 flex-1 flex items-center justify-center">
                  {item.odds && (
                    <div className="absolute top-2 right-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                      {item.odds}
                    </div>
                  )}
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={200}
                    height={150}
                    className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-gray-900/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    ${item.price?.toLocaleString() || "0"}
                  </div>
                  <Button className="absolute bottom-4 right-4 bg-black/80 text-white rounded-full h-6 w-20 text-xs transition-all duration-300 flex items-center justify-center gap-1">
                    BUY NOW →
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.brand}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
