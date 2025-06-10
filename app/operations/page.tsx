"use client"

import Link from "next/link"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserPlus, UserCheck, CreditCard } from "lucide-react"

const operationModules = [
  {
    id: "couple-registration",
    title: "Couple Registration",
    href: "/operations/couple-registration",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
    icon: Users,
    description: "Register new couples and manage their wedding planning journey",
  },
  {
    id: "vendor-registration",
    title: "Vendor Registration",
    href: "/operations/vendor-registration",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    icon: UserPlus,
    description: "Onboard new vendors and manage their service offerings",
  },
  {
    id: "vendor-selection",
    title: "Vendor Selection",
    href: "/operations/vendor-selection",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
    icon: UserCheck,
    description: "Help couples find and select the perfect vendors for their wedding",
  },
  {
    id: "payment",
    title: "Payment",
    href: "/operations/payment",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    icon: CreditCard,
    description: "Process payments and manage financial transactions",
  },
]

export default function OperationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-80">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=400&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-400/90 to-purple-600/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-4 border-white/20">
            <h1 className="font-playfair text-4xl font-bold text-white text-center">OPERATIONS</h1>
          </div>
        </div>
      </div>

      {/* Operations Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {operationModules.map((module) => (
            <Link key={module.id} href={module.href}>
              <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={module.image || "/placeholder.svg"}
                      alt={module.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <module.icon className="h-8 w-8 text-white mb-2" />
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">weddinggate</p>
        </div>
      </footer>
    </div>
  )
}
