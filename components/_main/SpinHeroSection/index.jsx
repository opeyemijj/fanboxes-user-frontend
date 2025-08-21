import Image from "next/image"
import { Button } from "@/components/Button"
import { Bell, ArrowRight, Hexagon } from "lucide-react"

export default function SpinHeroSection() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/ashley-powers.png"
              alt="Ashley Powers"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h1 className="text-4xl font-bold">Ashley Powers</h1>
              <p className="text-gray-500">Powers Picks</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" className="bg-gray-100 border-gray-200">
              <Bell className="h-4 w-4 mr-2" />
              Get Updates
            </Button>
            <Button variant="outline" className="bg-gray-100 border-gray-200">
              View Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="relative w-full h-[400px] bg-black overflow-hidden flex items-center justify-center rounded-lg">
          <Image
            src="/images/spinner-bg.png"
            alt="Banner background"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-cyan-600/60 to-purple-900/80" />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,250,0.05) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 max-w-5xl mx-auto px-4">
            <div className="relative">
              <Image
                src="/images/rolex-watch.png"
                alt="Rolex Watch"
                width={120}
                height={120}
                className="object-contain drop-shadow-2xl"
              />
            </div>

            <div className="relative">
              <Image
                src="/images/birkin-bag.png"
                alt="Birkin Bag"
                width={140}
                height={140}
                className="object-contain drop-shadow-2xl"
              />
            </div>

            <div className="relative flex flex-col items-center">
              <Image
                src="/images/airpods-pro.png"
                alt="AirPods Pro"
                width={160}
                height={160}
                className="object-contain drop-shadow-2xl"
              />
              <Button
                variant="cyan"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-40 rounded-full font-bold text-lg shadow-lg shadow-cyan-500/50"
              >
                <div className="flex items-center">
                  SPIN FOR
                  <Hexagon className="h-5 w-5 mx-1" />
                  100
                </div>
              </Button>
            </div>

            <div className="relative">
              <Image
                src="/images/dior-bag.png"
                alt="Dior Bag"
                width={130}
                height={130}
                className="object-contain drop-shadow-2xl"
              />
            </div>

            <div className="relative">
              <Image
                src="/images/clover-bracelet.png"
                alt="Van Cleef Bracelet"
                width={110}
                height={110}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
