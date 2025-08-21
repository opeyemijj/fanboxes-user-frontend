import Image from "next/image"
import { Button } from "@/components/Button"

export default function AmbassadorProfile({ ambassador }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm">
      <div className="md:flex items-start space-x-6">
        <div className="relative">
          <Image
            src={ambassador.image || "/placeholder.svg"}
            alt={ambassador.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg aspect-square object-cover"
            style={{ backgroundColor: "#11F2EB" }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">{ambassador.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {ambassador.description || "New box opening coming soon"}
          </p>
          <div className="flex items-center space-x-3">
            <Button className="bg-black text-white rounded-full px-6">🔔 GET UPDATES</Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent border-gray-300 dark:border-gray-600 dark:text-white"
            >
              📷
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent border-gray-300 dark:border-gray-600 dark:text-white"
            >
              🎵
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-transparent border-gray-300 dark:border-gray-600 dark:text-white"
            >
              <span className="text-sm font-bold">f</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
