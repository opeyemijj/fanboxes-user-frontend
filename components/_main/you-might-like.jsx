import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { MysteryBoxCard } from "@/components/_main/MysteryBoxCard"
import { recommendedBoxes } from "@/lib/data"

export default function YouMightLike() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">You might also like...</h2>
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-4">
            {recommendedBoxes.map((box) => (
              <CarouselItem key={box.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <MysteryBoxCard box={box} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  )
}
