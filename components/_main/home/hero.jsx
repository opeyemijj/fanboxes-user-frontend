import Image from "next/image"
import { Button } from "@/components/Button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden text-white flex flex-col justify-center items-start p-12">
      <Image
        src="/images/home-banner.jpg"
        alt="Every box is a new adventure"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20">
        <h1 className="text-6xl font-bold max-w-md leading-tight">
          Every box is a <span className="text-cyan-400">new adventure</span>
        </h1>
        <Link href="/">
          <Button variant="secondary" className="mt-6 bg-white text-black font-bold">
            GET STARTED <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
