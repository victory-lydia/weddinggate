import Link from "next/link"
import { Heart } from "lucide-react"

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "MIS", href: "/mis" },
    { name: "Diagnostic Kit", href: "/diagnostic" },
    { name: "TOPSIS Tool", href: "/topsis" },
    { name: "Dashboard", href: "/dashboard" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-rose-100">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.main.map((item) => (
            <Link key={item.name} href={item.href} className="text-gray-400 hover:text-rose-500 text-sm">
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start">
            <Heart className="h-5 w-5 text-rose-500 mr-2" />
            <span className="font-playfair text-lg font-semibold text-gray-900">Wedding Gate</span>
          </div>
          <p className="text-center text-xs leading-5 text-gray-500 md:text-left mt-2">
            &copy; 2024 Wedding Gate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
