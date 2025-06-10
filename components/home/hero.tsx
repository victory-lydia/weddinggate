import Link from "next/link"
import { ArrowRight, Heart, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-400 to-pink-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Elevate Your Wedding Planning Business with <span className="text-rose-600">Wedding Gate</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Comprehensive platform for wedding planners featuring client insights, performance diagnostics, and booking
            support. Grow your business with data-driven decisions and streamlined operations.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/register">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-rose-100 p-3">
                <Users className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Client Management</h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Comprehensive MIS for tracking couples, vendors, and bookings
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-rose-100 p-3">
                <TrendingUp className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Performance Analytics</h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Diagnostic tools and TOPSIS ranking for business optimization
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-rose-100 p-3">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">Wedding Focused</h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Purpose-built for the unique needs of wedding professionals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-rose-400 to-pink-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  )
}
