import Header from "@/components/_main/Header"
import HeroSection from "@/components/_main/HeroSection"
import WhatsInTheBox from "@/components/_main/WhatsInTheBox"
import YouMightLike from "@/components/_main/YouMightLike"
import Footer from "@/components/_main/Footer"

export default function HomePage() {
  return (
    <div className="bg-white text-black">
      <Header />
      <main className="pt-24">
        <HeroSection />
        <WhatsInTheBox />
        <YouMightLike />
      </main>
      <Footer />
    </div>
  )
}
