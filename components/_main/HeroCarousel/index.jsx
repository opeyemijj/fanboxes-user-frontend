"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import Link from "next/link";
import HeroCarouselSkeleton from "@/components/ui/skeletons/HeroCarouselSkeleton";
import { fetchCarouselItems } from "@/services/home/index";

const FALLBACK_BANNERS = [
  {
    id: 1,
    image: "/images/home-banner.jpg",
    title: "Every box is a",
    highlight: "new adventure",
    description: "Discover amazing products curated just for you",
    buttonText: "GET STARTED",
    buttonLink: "/influencer",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerItems, setBannerItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBanners = useCallback(async () => {
    try {
      const response = await fetchCarouselItems();

      if (
        response?.success &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        // Filter out invalid banners and ensure required fields
        const validBanners = response.data.filter(
          (banner) => banner?.image && banner?.title
        );

        if (validBanners.length > 0) {
          setBannerItems(validBanners);
        } else {
          setBannerItems(FALLBACK_BANNERS);
        }
      } else {
        setBannerItems(FALLBACK_BANNERS);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBannerItems(FALLBACK_BANNERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  useEffect(() => {
    if (bannerItems.length <= 1) return;

    const timer = setInterval(() => {
      // setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerItems.length]);

  const nextSlide = () => {
    if (bannerItems.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
  };

  const prevSlide = () => {
    if (bannerItems.length <= 1) return;
    setCurrentSlide(
      (prev) => (prev - 1 + bannerItems.length) % bannerItems.length
    );
  };

  const goToSlide = (index) => {
    if (bannerItems.length <= 1) return;
    setCurrentSlide(index);
  };

  if (isLoading) {
    return <HeroCarouselSkeleton />;
  }

  if (bannerItems.length === 0) {
    return (
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No banners available</p>
      </div>
    );
  }

  const hasMultipleBanners = bannerItems.length > 1;

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden group">
      <div className="relative w-full h-full">
        {bannerItems.map((banner, index) => (
          <div
            key={banner._id || banner.id || index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={banner.title || "Banner image"}
              fill
              className="object-cover z-0"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Content overlay - only show if there's content */}
            {(banner.title ||
              banner.highlight ||
              banner.description ||
              banner.buttonText) && (
              <div className="relative z-20 text-white flex flex-col justify-center items-start p-8 md:p-12 h-full max-w-2xl">
                {/* Title and Highlight */}
                {(banner.title || banner.highlight) && (
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sofia-pro-bold-font">
                    {banner.title && <span>{banner.title} </span>}
                    {banner.highlight && (
                      <span className="text-[#11F2EB]">{banner.highlight}</span>
                    )}
                  </h1>
                )}

                {/* Description */}
                {banner.description && (
                  <p className="text-base md:text-lg leading-relaxed opacity-90 mb-6 max-w-lg sofia-pro-regula-font">
                    {banner.description}
                  </p>
                )}

                {/* Button - only show if both text and link exist */}
                {banner?.buttonText && banner?.buttonLink && (
                  <Link href={banner.buttonLink}>
                    <Button className="bg-white text-black font-semibold hover:bg-gray-100 px-6 py-3 rounded-lg transition-colors">
                      {banner.buttonText} <span className="ml-2">→</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMultipleBanners && (
        <>
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
            {bannerItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-8 h-1 rounded-full transition-all ${
                  index === currentSlide ? "bg-[#11F2EB]" : "bg-white/50"
                } hover:bg-white/70`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
