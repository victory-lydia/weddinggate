import { BarChart3, Users, ClipboardCheck, Award, Shield, Smartphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    name: "Management Information System",
    description:
      "Complete dashboard for tracking couple registrations, vendor management, bookings, and invoicing with real-time updates.",
    icon: BarChart3,
  },
  {
    name: "Diagnostic Kit",
    description: "Dynamic Q&A interface categorized by user types with automatic scoring and visualization of results.",
    icon: ClipboardCheck,
  },
  {
    name: "TOPSIS Evaluation Tool",
    description: "Advanced ranking system for wedding planners using weighted criteria and engaging visual charts.",
    icon: Award,
  },
  {
    name: "Role-Based Access",
    description: "Secure authentication with different access levels for admins, planners, and couples.",
    icon: Shield,
  },
  {
    name: "Client Insights",
    description: "Comprehensive analytics and reporting to help you understand your clients better.",
    icon: Users,
  },
  {
    name: "Mobile Responsive",
    description: "Access your business tools anywhere with our fully responsive mobile design.",
    icon: Smartphone,
  },
]

export function Features() {
  return (
    <div id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-playfair text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to grow your wedding business
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our comprehensive platform provides all the tools and insights you need to take your wedding planning
            business to the next level.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.name} className="border-rose-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="rounded-lg bg-rose-100 p-2 w-fit">
                    <feature.icon className="h-6 w-6 text-rose-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
