import Header from "@/components/_main/Header"
import SpinHeroSection from "@/components/_main/SpinHeroSection"
import WhatsInTheBox from "@/components/_main/WhatsInTheBox"
import YouMightLike from "@/components/_main/YouMightLike"
import Footer from "@/components/_main/Footer"

export default function InfluencerPage() {
  return (
    <div className="bg-white text-black">
      <Header />
      <main className="pt-24">
        <SpinHeroSection />
        <WhatsInTheBox />
        <YouMightLike />
      </main>
      <Footer />
    </div>
  )
}
