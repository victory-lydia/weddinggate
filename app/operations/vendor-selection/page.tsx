"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Search, MapPin, Star, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { analyticsManager } from "@/lib/analytics"

export default function VendorSelectionPage() {
  const [searchCriteria, setSearchCriteria] = useState({
    category: "",
    region: "",
    city: "",
    maxBudget: "",
    languages: [] as string[],
    rating: "",
  })
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [couples, setCouples] = useState<any[]>([])
  const [selectedCouple, setSelectedCouple] = useState("")
  const { toast } = useToast()

  // Load vendors and couples from analytics
  useEffect(() => {
    const data = analyticsManager.getData()
    setVendors(data.vendors)
    setCouples(data.couples)
  }, [])

  const handleSearch = () => {
    // Filter logic would go here
    console.log("Searching with criteria:", searchCriteria)
  }

  const toggleVendorSelection = (vendorId: string) => {
    setSelectedVendors((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]))
  }

  const handleConfirmSelection = () => {
    if (!selectedCouple) {
      toast({
        title: "Please select a couple",
        description: "You need to select a couple before confirming vendor selection.",
        variant: "destructive",
      })
      return
    }

    if (selectedVendors.length === 0) {
      toast({
        title: "No vendors selected",
        description: "Please select at least one vendor.",
        variant: "destructive",
      })
      return
    }

    // Create bookings for each selected vendor
    selectedVendors.forEach((vendorId) => {
      const vendor = vendors.find((v) => v.id === vendorId)
      const couple = couples.find((c) => c.id === selectedCouple)

      if (vendor && couple) {
        // Generate a realistic booking amount based on vendor category
        const getBookingAmount = (category: string) => {
          switch (category) {
            case "photographer":
              return Math.floor(Math.random() * 500000) + 300000 // 300k - 800k
            case "caterer":
              return Math.floor(Math.random() * 2000000) + 1000000 // 1M - 3M
            case "decorator":
              return Math.floor(Math.random() * 1500000) + 500000 // 500k - 2M
            case "musician":
              return Math.floor(Math.random() * 400000) + 200000 // 200k - 600k
            case "venue":
              return Math.floor(Math.random() * 3000000) + 1000000 // 1M - 4M
            default:
              return Math.floor(Math.random() * 800000) + 200000 // 200k - 1M
          }
        }

        analyticsManager.addBooking({
          coupleId: selectedCouple,
          vendorId: vendorId,
          serviceType: vendor.category,
          amount: getBookingAmount(vendor.category),
          eventDate: couple.weddingDate,
          region: couple.region,
        })
      }
    })

    toast({
      title: "Vendors selected successfully!",
      description: `${selectedVendors.length} vendor(s) have been booked for the couple.`,
    })

    // Reset selections
    setSelectedVendors([])
    setSelectedCouple("")
  }

  const filteredVendors = vendors.filter((vendor) => {
    if (searchCriteria.category && vendor.category !== searchCriteria.category) return false
    if (searchCriteria.region && vendor.region !== searchCriteria.region) return false
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Vendor Selection</h1>
          <p className="text-gray-600">Find and select the best vendors for your wedding</p>
        </div>

        {/* Couple Selection */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Select Couple</CardTitle>
            <CardDescription>Choose the couple for whom you're selecting vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCouple} onValueChange={setSelectedCouple}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a couple" />
              </SelectTrigger>
              <SelectContent>
                {couples.map((couple) => (
                  <SelectItem key={couple.id} value={couple.id}>
                    {couple.names.join(" & ")} - {couple.weddingDate} ({couple.region})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {couples.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No couples registered yet. Please register couples first in the Couple Registration section.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Search Filters */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search Criteria</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={searchCriteria.category}
                  onValueChange={(value) => setSearchCriteria((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="photographer">Photographer</SelectItem>
                    <SelectItem value="caterer">Caterer</SelectItem>
                    <SelectItem value="decorator">Decorator</SelectItem>
                    <SelectItem value="musician">Musician/DJ</SelectItem>
                    <SelectItem value="florist">Florist</SelectItem>
                    <SelectItem value="venue">Venue</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="makeup">Makeup Artist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={searchCriteria.region}
                  onValueChange={(value) => setSearchCriteria((prev) => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    <SelectItem value="Centre">Centre</SelectItem>
                    <SelectItem value="Littoral">Littoral</SelectItem>
                    <SelectItem value="West">West</SelectItem>
                    <SelectItem value="Northwest">Northwest</SelectItem>
                    <SelectItem value="Southwest">Southwest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={searchCriteria.city}
                  onChange={(e) => setSearchCriteria((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Max Budget (FCFA)</Label>
                <Input
                  id="budget"
                  value={searchCriteria.maxBudget}
                  onChange={(e) => setSearchCriteria((prev) => ({ ...prev, maxBudget: e.target.value }))}
                  placeholder="1,000,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Minimum Rating</Label>
                <Select
                  value={searchCriteria.rating}
                  onValueChange={(value) => setSearchCriteria((prev) => ({ ...prev, rating: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ratings</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </CardContent>
        </Card>

        {/* Vendor Results */}
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredVendors.map((vendor) => (
              <Card
                key={vendor.id}
                className={`bg-white shadow-lg transition-all duration-300 ${selectedVendors.includes(vendor.id) ? "ring-2 ring-green-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{vendor.businessName}</CardTitle>
                      <CardDescription className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{vendor.category}</Badge>
                        <span className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vendor.city}, {vendor.region}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating || "4.5"}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Status: <span className="font-medium text-gray-900">{vendor.status}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Completed Bookings: <span className="font-medium">{vendor.completedBookings || 0}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => toggleVendorSelection(vendor.id)}
                        className={selectedVendors.includes(vendor.id) ? "bg-green-600 hover:bg-green-700" : ""}
                        disabled={!selectedCouple}
                      >
                        {selectedVendors.includes(vendor.id) ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white shadow-lg mb-8">
            <CardContent className="p-8 text-center">
              <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Vendors Available</h3>
              <p className="text-gray-600 mb-4">
                No vendors have been registered yet. Please register vendors first in the Vendor Registration section.
              </p>
              <Button asChild>
                <a href="/operations/vendor-registration">Register Vendors</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Selected Vendors Summary */}
        {selectedVendors.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Selected Vendors ({selectedVendors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-green-700">
                  You have selected {selectedVendors.length} vendor(s) for{" "}
                  {selectedCouple ? couples.find((c) => c.id === selectedCouple)?.names.join(" & ") : "the couple"}.
                </p>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setSelectedVendors([])}>
                    Clear Selection
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirmSelection}>
                    Confirm Selection & Create Bookings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
