"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Heart, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { analyticsManager } from "@/lib/analytics"

const cameroonRegions = [
  "Adamawa",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "Northwest",
  "South",
  "Southwest",
  "West",
]

const cameroonCities = {
  Centre: ["Yaoundé", "Mbalmayo", "Obala", "Akonolinga", "Bafia"],
  Littoral: ["Douala", "Edéa", "Nkongsamba", "Loum", "Mbanga"],
  West: ["Bafoussam", "Dschang", "Mbouda", "Bandjoun", "Foumban"],
  Northwest: ["Bamenda", "Kumbo", "Wum", "Ndop", "Bafut"],
  Southwest: ["Buea", "Limbe", "Kumba", "Tiko", "Mamfe"],
  North: ["Garoua", "Maroua", "Ngaoundéré", "Guider", "Mokolo"],
  "Far North": ["Maroua", "Kousseri", "Mokolo", "Yagoua", "Waza"],
  East: ["Bertoua", "Batouri", "Yokadouma", "Abong-Mbang", "Kenzou"],
  South: ["Ebolowa", "Sangmélima", "Kribi", "Ambam", "Djoum"],
  Adamawa: ["Ngaoundéré", "Meiganga", "Banyo", "Tignère", "Tibati"],
}

export default function CoupleRegistrationPage() {
  const [formData, setFormData] = useState({
    partner1Name: "",
    partner1CNI: "",
    partner1Phone: "",
    partner1Profession: "",
    partner2Name: "",
    partner2CNI: "",
    partner2Phone: "",
    partner2Profession: "",
    email: "",
    region: "",
    city: "",
    quarter: "",
    weddingDate: "",
    weddingType: "",
    budget: "",
    guestCount: "",
    venue: "",
    religion: "",
    tribe1: "",
    tribe2: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation
    if (!formData.partner1Name || !formData.partner2Name || !formData.email) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save to analytics
      analyticsManager.addCouple({
        names: [formData.partner1Name, formData.partner2Name],
        email: formData.email,
        phone: [formData.partner1Phone, formData.partner2Phone].filter(Boolean),
        region: formData.region,
        city: formData.city,
        weddingDate: formData.weddingDate,
        budget: Number(formData.budget) || 0,
        guestCount: Number(formData.guestCount) || 0,
      })

      toast({
        title: "Registration successful!",
        description: "The couple has been registered successfully and added to analytics.",
      })

      // Reset form
      setFormData({
        partner1Name: "",
        partner1CNI: "",
        partner1Phone: "",
        partner1Profession: "",
        partner2Name: "",
        partner2CNI: "",
        partner2Phone: "",
        partner2Profession: "",
        email: "",
        region: "",
        city: "",
        quarter: "",
        weddingDate: "",
        weddingType: "",
        budget: "",
        guestCount: "",
        venue: "",
        religion: "",
        tribe1: "",
        tribe2: "",
        notes: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Couple Registration</h1>
          <p className="text-gray-600">Register new couples according to Cameroon standards</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>First Partner Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner1Name">Full Name *</Label>
                  <Input
                    id="partner1Name"
                    value={formData.partner1Name}
                    onChange={(e) => handleInputChange("partner1Name", e.target.value)}
                    placeholder="First and last name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner1CNI">CNI Number *</Label>
                  <Input
                    id="partner1CNI"
                    value={formData.partner1CNI}
                    onChange={(e) => handleInputChange("partner1CNI", e.target.value)}
                    placeholder="e.g., 123456789012"
                    maxLength={12}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner1Phone">Phone Number *</Label>
                  <Input
                    id="partner1Phone"
                    value={formData.partner1Phone}
                    onChange={(e) => handleInputChange("partner1Phone", e.target.value)}
                    placeholder="e.g., +237 6XX XX XX XX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner1Profession">Profession</Label>
                  <Input
                    id="partner1Profession"
                    value={formData.partner1Profession}
                    onChange={(e) => handleInputChange("partner1Profession", e.target.value)}
                    placeholder="Profession or occupation"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tribe1">Tribe/Ethnicity</Label>
                <Input
                  id="tribe1"
                  value={formData.tribe1}
                  onChange={(e) => handleInputChange("tribe1", e.target.value)}
                  placeholder="e.g., Bamiléké, Bassa, Fulani, etc."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Second Partner Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner2Name">Full Name *</Label>
                  <Input
                    id="partner2Name"
                    value={formData.partner2Name}
                    onChange={(e) => handleInputChange("partner2Name", e.target.value)}
                    placeholder="First and last name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner2CNI">CNI Number *</Label>
                  <Input
                    id="partner2CNI"
                    value={formData.partner2CNI}
                    onChange={(e) => handleInputChange("partner2CNI", e.target.value)}
                    placeholder="e.g., 123456789012"
                    maxLength={12}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partner2Phone">Phone Number *</Label>
                  <Input
                    id="partner2Phone"
                    value={formData.partner2Phone}
                    onChange={(e) => handleInputChange("partner2Phone", e.target.value)}
                    placeholder="e.g., +237 6XX XX XX XX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner2Profession">Profession</Label>
                  <Input
                    id="partner2Profession"
                    value={formData.partner2Profession}
                    onChange={(e) => handleInputChange("partner2Profession", e.target.value)}
                    placeholder="Profession or occupation"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tribe2">Tribe/Ethnicity</Label>
                <Input
                  id="tribe2"
                  value={formData.tribe2}
                  onChange={(e) => handleInputChange("tribe2", e.target.value)}
                  placeholder="e.g., Bamiléké, Bassa, Fulani, etc."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Contact Information and Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="couple@example.com"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameroonRegions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleInputChange("city", value)}
                    disabled={!formData.region}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.region &&
                        cameroonCities[formData.region as keyof typeof cameroonCities]?.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quarter">Quarter/District</Label>
                <Input
                  id="quarter"
                  value={formData.quarter}
                  onChange={(e) => handleInputChange("quarter", e.target.value)}
                  placeholder="e.g., Bastos, Akwa, Bonanjo, etc."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Wedding Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weddingDate">Wedding Date *</Label>
                  <Input
                    id="weddingDate"
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => handleInputChange("weddingDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weddingType">Wedding Type</Label>
                  <Select
                    value={formData.weddingType}
                    onValueChange={(value) => handleInputChange("weddingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type of ceremony" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil Marriage</SelectItem>
                      <SelectItem value="religious">Religious Marriage</SelectItem>
                      <SelectItem value="traditional">Traditional Marriage</SelectItem>
                      <SelectItem value="combined">Combined Marriage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget (FCFA)</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    placeholder="e.g., 5,000,000 FCFA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => handleInputChange("guestCount", e.target.value)}
                    placeholder="e.g., 200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Reception Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange("venue", e.target.value)}
                    placeholder="Venue name or address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Select value={formData.religion} onValueChange={(value) => handleInputChange("religion", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Primary religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="catholic">Catholic</SelectItem>
                      <SelectItem value="protestant">Protestant</SelectItem>
                      <SelectItem value="pentecostal">Pentecostal</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="traditional">Traditional Religion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Special requirements, particular traditions, allergies, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700">
              <Calendar className="h-4 w-4 mr-2" />
              {loading ? "Registering..." : "Register Couple"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
