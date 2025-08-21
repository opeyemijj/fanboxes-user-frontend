import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"
import { categories } from "@/lib/data-v2"

export default function Categories() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">Our categories</h2>
      <div className="flex flex-wrap gap-2">
        <Button className="text-black hover:bg-cyan-500 rounded-full" style={{ backgroundColor: "#11F2EB" }}>
          All <X className="ml-2 h-4 w-4" />
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="border-gray-200 rounded-full bg-transparent"
            style={{ backgroundColor: "#98989F", color: "white" }}
          >
            {category} <ArrowRight className="ml-2 h-4 w-4 text-gray-400" />
          </Button>
        ))}
      </div>
    </section>
  )
}
