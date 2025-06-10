"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if it's an admin email (simple check for demo)
      if (!email.includes("admin")) {
        toast({
          title: "Access Denied",
          description: "Admin credentials required for this login.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const success = await login(email, password)
      if (success) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin dashboard.",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Please check your admin credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-purple-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="font-playfair text-2xl">Admin Access</CardTitle>
          <CardDescription>Sign in to the Wedding Gate admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@weddinggate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? "Signing in..." : "Admin Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Not an admin? </span>
            <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-medium">
              User login
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/auth" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to login selection
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
