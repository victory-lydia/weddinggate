"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Topsis",
    href: "/topsis",
    hasDropdown: true,
    dropdownItems: [
      { name: "TOPSIS Tool", href: "/topsis" },
      { name: "Ranking System", href: "/topsis/ranking" },
      { name: "Evaluation Criteria", href: "/topsis/criteria" },
    ],
  },
  {
    name: "Operations",
    href: "/operations",
    hasDropdown: true,
    dropdownItems: [
      { name: "Couple Registration", href: "/operations/couple-registration" },
      { name: "Vendor Registration", href: "/operations/vendor-registration" },
      { name: "Vendor Selection", href: "/operations/vendor-selection" },
      { name: "Payment", href: "/operations/payment" },
    ],
  },
  { name: "Analytics", href: "/analytics" },
  { name: "WedChat", href: "/wedchat" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="bg-blue-600 border-b border-blue-700 sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <span className="font-playfair text-2xl font-bold text-white">weddinggate</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <div key={item.name} className="relative">
              {item.hasDropdown ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`text-sm font-semibold leading-6 transition-colors flex items-center space-x-1 ${
                        pathname.startsWith(item.href) ? "text-yellow-300" : "text-white hover:text-yellow-200"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <DropdownMenuItem key={dropdownItem.name} asChild>
                        <Link href={dropdownItem.href} className="cursor-pointer">
                          {dropdownItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-semibold leading-6 transition-colors ${
                    pathname === item.href ? "text-yellow-300" : "text-white hover:text-yellow-200"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <Search className="h-4 w-4" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-blue-700">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" className="text-white hover:bg-blue-700">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <span className="font-playfair text-xl font-bold text-gray-900">weddinggate</span>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.hasDropdown && item.dropdownItems && (
                        <div className="ml-4 space-y-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="-mx-3 block rounded-lg px-3 py-1 text-sm leading-6 text-gray-600 hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="py-6">
                  {user ? (
                    <Button onClick={logout} variant="ghost" className="w-full justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout ({user.name})
                    </Button>
                  ) : (
                    <Link href="/auth" className="block">
                      <Button variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
