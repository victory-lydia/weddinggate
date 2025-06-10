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
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, Building, Star } from "lucide-react"
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

const vendorCategories = [
  { value: "photographer", label: "Photographer/Videographer" },
  { value: "caterer", label: "Caterer/Restaurant" },
  { value: "decorator", label: "Decorator/Event Organizer" },
  { value: "musician", label: "Musician/DJ" },
  { value: "florist", label: "Florist" },
  { value: "venue", label: "Venue Owner" },
  { value: "transport", label: "Transportation/Car Rental" },
  { value: "makeup", label: "Makeup Artist/Hair Stylist" },
  { value: "clothing", label: "Tailor/Fashion Designer" },
  { value: "jewelry", label: "Jeweler" },
  { value: "security", label: "Security Services" },
  { value: "other", label: "Other" },
]

export default function VendorRegistrationPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    cni: "",
    businessLicense: "",
    taxNumber: "",
    vendorCategory: "",
    subServices: [] as string[],
    email: "",
    phone1: "",
    phone2: "",
    region: "",
    city: "",
    quarter: "",
    address: "",
    website: "",
    experience: "",
    portfolio: "",
    services: "",
    pricing: "",
    availability: "",
    languages: [] as string[],
    bankName: "",
    accountNumber: "",
    mobileMoney: "",
    insurance: false,
    references: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, languages: [...prev.languages, language] }))
    } else {
      setFormData((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== language) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation
    if (!formData.businessName || !formData.contactName || !formData.email || !formData.vendorCategory) {
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
      analyticsManager.addVendor({
        businessName: formData.businessName,
        category: formData.vendorCategory,
        region: formData.region,
        city: formData.city,
        email: formData.email,
        phone: formData.phone1,
      })

      toast({
        title: "Registration successful!",
        description: "The vendor has been registered successfully and added to analytics.",
      })

      // Reset form
      setFormData({
        businessName: "",
        contactName: "",
        cni: "",
        businessLicense: "",
        taxNumber: "",
        vendorCategory: "",
        subServices: [],
        email: "",
        phone1: "",
        phone2: "",
        region: "",
        city: "",
        quarter: "",
        address: "",
        website: "",
        experience: "",
        portfolio: "",
        services: "",
        pricing: "",
        availability: "",
        languages: [],
        bankName: "",
        accountNumber: "",
        mobileMoney: "",
        insurance: false,
        references: "",
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
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Vendor Registration</h1>
          <p className="text-gray-600">Register new vendors according to Cameroon standards</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Business Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="Business or company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Primary Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    placeholder="Name of responsible person"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cni">CNI Number *</Label>
                  <Input
                    id="cni"
                    value={formData.cni}
                    onChange={(e) => handleInputChange("cni", e.target.value)}
                    placeholder="Contact person's CNI"
                    maxLength={12}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License</Label>
                  <Input
                    id="businessLicense"
                    value={formData.businessLicense}
                    onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                    placeholder="License number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={formData.taxNumber}
                    onChange={(e) => handleInputChange("taxNumber", e.target.value)}
                    placeholder="Taxpayer number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Services and Specialties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vendorCategory">Primary Category *</Label>
                <Select
                  value={formData.vendorCategory}
                  onValueChange={(value) => handleInputChange("vendorCategory", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="services">Service Description *</Label>
                <Textarea
                  id="services"
                  value={formData.services}
                  onChange={(e) => handleInputChange("services", e.target.value)}
                  placeholder="Describe in detail the services you offer..."
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="Number of years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing">Price Range (FCFA)</Label>
                  <Input
                    id="pricing"
                    value={formData.pricing}
                    onChange={(e) => handleInputChange("pricing", e.target.value)}
                    placeholder="e.g., 50,000 - 500,000 FCFA"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Languages Spoken</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["French", "English", "Fulfulde", "Ewondo", "Duala", "Bamiléké"].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={language}
                        checked={formData.languages.includes(language)}
                        onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                      />
                      <Label htmlFor={language} className="text-sm">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://www.mywebsite.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone1">Primary Phone *</Label>
                  <Input
                    id="phone1"
                    value={formData.phone1}
                    onChange={(e) => handleInputChange("phone1", e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone2">Secondary Phone</Label>
                  <Input
                    id="phone2"
                    value={formData.phone2}
                    onChange={(e) => handleInputChange("phone2", e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                  />
                </div>
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
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Primary city"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Complete physical address with quarter"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank</Label>
                  <Select value={formData.bankName} onValueChange={(value) => handleInputChange("bankName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bicec">BICEC</SelectItem>
                      <SelectItem value="sgbc">SGBC</SelectItem>
                      <SelectItem value="cca">CCA Bank</SelectItem>
                      <SelectItem value="uba">UBA</SelectItem>
                      <SelectItem value="ecobank">Ecobank</SelectItem>
                      <SelectItem value="afriland">Afriland First Bank</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    placeholder="Bank account number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileMoney">Mobile Money</Label>
                <Input
                  id="mobileMoney"
                  value={formData.mobileMoney}
                  onChange={(e) => handleInputChange("mobileMoney", e.target.value)}
                  placeholder="Orange Money or MTN MoMo number"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance"
                  checked={formData.insurance}
                  onCheckedChange={(checked) => handleInputChange("insurance", checked as boolean)}
                />
                <Label htmlFor="insurance">Has professional insurance</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Portfolio and References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Previous Work</Label>
                <Textarea
                  id="portfolio"
                  value={formData.portfolio}
                  onChange={(e) => handleInputChange("portfolio", e.target.value)}
                  placeholder="Links to portfolio, photos of previous work, etc."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="references">Client References</Label>
                <Textarea
                  id="references"
                  value={formData.references}
                  onChange={(e) => handleInputChange("references", e.target.value)}
                  placeholder="Names and contacts of previous clients (with their permission)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange("availability", e.target.value)}
                  placeholder="Days and hours of availability, periods of unavailability, etc."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional information, special specialties, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Star className="h-4 w-4 mr-2" />
              {loading ? "Registering..." : "Register Vendor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
