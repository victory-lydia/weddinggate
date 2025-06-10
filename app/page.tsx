import { Navbar } from "@/components/navigation/navbar"
import { Features } from "@/components/home/features"
import { About } from "@/components/home/about"
import { CTA } from "@/components/home/cta"
import { Footer } from "@/components/home/footer"
import { Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Navbar />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Background with wedding image */}
        <div className="absolute inset-0 -z-10">
          <div
            className="w-full h-full bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url('https://sjc.microlink.io/FSeD455jsy0LVpVVzrof8Qlwfl7G-H2aS3096Dw81vusNDlT6Q4t-OhIWJM-IcHhHYexaRMMfNHrq2OPKB3iPQ.jpeg')`,
            }}
          ></div>
        </div>

        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-400 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            {/* Add circular logo */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>

            <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Elevate Your Wedding Planning Business with <span className="text-purple-600">Wedding Gate</span>
            </h1>
          </div>
        </div>
      </div>
      <Features />
      <About />
      <CTA />
      <Footer />
    </div>
  )
}
