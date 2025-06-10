"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"

const vendorTypes = [
  { value: "photographer", label: "Photographer" },
  { value: "musician", label: "Musician/DJ" },
  { value: "caterer", label: "Caterer" },
  { value: "transportation", label: "Transportation" },
  { value: "florist", label: "Florist" },
  { value: "decorator", label: "Decorator" },
  { value: "gifts", label: "Gifts & Favors" },
  { value: "planner", label: "Wedding Planner" },
  { value: "venue", label: "Venue" },
  { value: "makeup", label: "Makeup Artist" },
  { value: "other", label: "Other" },
]

export default function VendorSelectionPage() {
  const [formData, setFormData] = useState({
    vendorType: "",
    location: "",
    name: "",
    contact: "",
  })
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    if (!formData.vendorType || !formData.location || !formData.name || !formData.contact) {
      toast({
        title: "Please fill in all required fields",
        description: "All fields marked with * are required.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Store vendor information
      localStorage.setItem("vendor-info", JSON.stringify(formData))

      toast({
        title: "Information submitted successfully!",
        description: "Thank you for providing your vendor information.",
      })

      // Redirect to diagnostic page
      router.push("/diagnostic")
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header */}
      <div className="bg-blue-600 h-16 w-full"></div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800">Vendor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Who are you? */}
              <div className="space-y-2">
                <Label htmlFor="vendorType" className="text-gray-700 font-medium">
                  Who are you? <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.vendorType} onValueChange={(value) => handleInputChange("vendorType", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your vendor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Where are you located? */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Where are you located? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State or Region"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Your Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Your Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name or business name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Phone or Email */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-gray-700 font-medium">
                  Phone or Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="Phone number or email address"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium"
              >
                {loading ? "Submitting..." : "Submit Information"}
              </Button>
            </form>

            {/* Skip Option */}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/diagnostic")}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Skip for now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
