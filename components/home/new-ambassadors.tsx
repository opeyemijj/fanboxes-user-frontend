import Image from "next/image"
import { Button } from "@/components/Button"
import { ArrowRight } from "lucide-react"
import { newAmbassadors } from "@/lib/data-v2"

export default function NewAmbassadors() {
  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-6">New ambassadors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {newAmbassadors.map((ambassador) => (
          <div key={ambassador.id} className="group">
            <div className="relative rounded-lg overflow-hidden aspect-[4/5]">
              <Image
                src={ambassador.image || "/placeholder.svg"}
                alt={ambassador.name}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              {ambassador.isNew && (
                <div className="absolute top-3 left-3 bg-cyan-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
              <Button className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full h-10 w-28 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="font-bold mt-2">{ambassador.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
