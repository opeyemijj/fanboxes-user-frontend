"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/Button"
import Link from "next/link"

const banners = [
  {
    id: 1,
    image: "/images/home-banner.jpg",
    title: "Every box is a",
    highlight: "new adventure",
    description: "Discover amazing products curated just for you",
    buttonText: "GET STARTED",
    buttonLink: "/influencer",
  },
  {
    id: 2,
    image: "/images/home-banner-2.jpg",
    title: "Unlock exclusive",
    highlight: "mystery boxes",
    description: "Premium items from top brands delivered to your door",
    buttonText: "EXPLORE BOXES",
    buttonLink: "/mystery-boxes",
  },
  {
    id: 3,
    image: "/images/home-banner-3.jpg",
    title: "Join our",
    highlight: "ambassador program",
    description: "Earn rewards and share your favorite discoveries",
    buttonText: "BECOME AMBASSADOR",
    buttonLink: "/ambassadors",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden group">
      {/* Carousel slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={`${banner.title} ${banner.highlight}`}
              layout="fill"
              objectFit="cover"
              className="z-0"
            />
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="relative z-20 text-white flex flex-col justify-center items-start p-8 md:p-12 h-full max-w-2xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
                {banner.title} <span style={{ color: "#11F2EB" }}>{banner.highlight}</span>
              </h1>
              <p className="text-base md:text-lg leading-relaxed opacity-90 mb-6 max-w-lg">{banner.description}</p>
              <Link href={banner.buttonLink}>
                <Button className="bg-white text-black font-semibold hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors">
                  {banner.buttonText} <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
        aria-label="Previous slide"
      >
        <span className="text-xl">‹</span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center"
        aria-label="Next slide"
      >
        <span className="text-xl">›</span>
      </button>

      <div className="absolute bottom-4 left-8 md:left-12 z-30 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-8 h-1 rounded-full transition-all ${
              index === currentSlide ? "hover:bg-white/70" : "bg-white/50 hover:bg-white/70"
            }`}
            style={{
              backgroundColor: index === currentSlide ? "#11F2EB" : undefined,
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
