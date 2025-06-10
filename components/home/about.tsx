import { CheckCircle } from "lucide-react"

const benefits = [
  "Streamlined client and vendor management",
  "Data-driven business insights and analytics",
  "Automated scoring and evaluation systems",
  "Real-time booking and invoice tracking",
  "Mobile-responsive design for on-the-go access",
  "Secure role-based authentication",
]

export function About() {
  return (
    <div className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-rose-600">About Wedding Gate</h2>
              <p className="mt-2 font-playfair text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Empowering Wedding Professionals
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Wedding Gate is designed specifically for wedding planners who want to grow their businesses through
                better client insights, performance diagnostics, and streamlined operations. Our platform combines
                powerful analytics with user-friendly interfaces to help you make data-driven decisions.
              </p>

              <dl className="mt-10 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex gap-x-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-none text-rose-600" />
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 p-8">
              <div className="h-full w-full rounded-lg bg-white shadow-xl p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-rose-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">Dashboard Preview</div>
                      <div className="text-sm text-gray-500 mt-2">Analytics & Insights</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-rose-100 rounded"></div>
                    <div className="h-16 bg-pink-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
