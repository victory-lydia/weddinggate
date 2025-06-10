"use client"

import Link from "next/link"
import { Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthSelectionPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://sjc.microlink.io/FSeD455jsy0LVpVVzrof8Qlwfl7G-H2aS3096Dw81vusNDlT6Q4t-OhIWJM-IcHhHYexaRMMfNHrq2OPKB3iPQ.jpeg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Header with Circular Logo */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-400/90 to-purple-600/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-4 border-white/20">
                <div className="text-center">
                  <h1 className="font-playfair text-3xl font-bold text-white">WEDDING</h1>
                  <h1 className="font-playfair text-3xl font-bold text-white">GATE</h1>
                </div>
              </div>
            </div>
            <p className="text-xl text-white font-medium">Choose your login type to continue</p>
          </div>

          {/* Login Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* User Login */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-rose-300 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-rose-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">User Login</CardTitle>
                <CardDescription className="text-gray-600">For wedding planners, couples, and vendors</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
                    Access diagnostic tools
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
                    Manage your events
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>
                    Client management tools
                  </div>
                </div>
                <Link href="/auth/login" className="block">
                  <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white">Continue as User</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Admin Login */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-purple-300 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
                <CardDescription className="text-gray-600">For system administrators and managers</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    TOPSIS evaluation tools
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Analytics dashboard
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    System operations
                  </div>
                </div>
                <Link href="/auth/admin-login" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Continue as Admin</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
