"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Smartphone, Building, Receipt, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { analyticsManager } from "@/lib/analytics"

const paymentMethods = [
  { id: "orange", name: "Orange Money", icon: Smartphone, color: "bg-orange-500" },
  { id: "mtn", name: "MTN Mobile Money", icon: Smartphone, color: "bg-yellow-500" },
  { id: "bank", name: "Bank Transfer", icon: Building, color: "bg-blue-500" },
  { id: "cash", name: "Cash", icon: Receipt, color: "bg-green-500" },
]

const cameroonBanks = [
  "BICEC",
  "SGBC",
  "CCA Bank",
  "UBA",
  "Ecobank",
  "Afriland First Bank",
  "Commercial Bank",
  "NFC Bank",
]

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState({
    selectedBooking: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    serviceType: "",
    vendorName: "",
    amount: "",
    paymentMethod: "",
    mobileNumber: "",
    bankName: "",
    accountNumber: "",
    reference: "",
    description: "",
    installments: false,
    installmentPlan: "",
  })
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const { toast } = useToast()

  // Load bookings from analytics
  useEffect(() => {
    const data = analyticsManager.getData()
    const pendingBookings = data.bookings.filter((booking) => booking.paymentStatus === "pending")
    setBookings(pendingBookings)
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBookingSelect = (bookingId: string) => {
    const data = analyticsManager.getData()
    const booking = data.bookings.find((b) => b.id === bookingId)
    const couple = data.couples.find((c) => c.id === booking?.coupleId)
    const vendor = data.vendors.find((v) => v.id === booking?.vendorId)

    if (booking && couple && vendor) {
      setPaymentData((prev) => ({
        ...prev,
        selectedBooking: bookingId,
        clientName: couple.names.join(" & "),
        clientPhone: couple.phone[0] || "",
        clientEmail: couple.email,
        serviceType: booking.serviceType,
        vendorName: vendor.businessName,
        amount: booking.amount.toString(),
      }))
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Save payment to analytics
      if (paymentData.selectedBooking) {
        const fees = paymentData.paymentMethod === "cash" ? 0 : 2500
        analyticsManager.addPayment({
          bookingId: paymentData.selectedBooking,
          amount: Number(paymentData.amount),
          method: paymentData.paymentMethod as "orange" | "mtn" | "bank" | "cash",
          fees,
        })
      }

      setPaymentSuccess(true)
      toast({
        title: "Payment successful!",
        description: "The payment has been processed successfully and added to analytics.",
      })
    } catch (error) {
      toast({
        title: "Payment error",
        description: "An error occurred while processing the payment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Card className="bg-white shadow-lg text-center">
            <CardContent className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">
                Your payment of {Number(paymentData.amount).toLocaleString()} FCFA has been processed successfully.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Transaction Reference:</p>
                <p className="font-mono text-lg font-bold">WG-{Date.now()}</p>
              </div>
              <div className="space-x-4">
                <Button onClick={() => window.print()} variant="outline">
                  Print Receipt
                </Button>
                <Button
                  onClick={() => {
                    setPaymentSuccess(false)
                    setPaymentData({
                      selectedBooking: "",
                      clientName: "",
                      clientPhone: "",
                      clientEmail: "",
                      serviceType: "",
                      vendorName: "",
                      amount: "",
                      paymentMethod: "",
                      mobileNumber: "",
                      bankName: "",
                      accountNumber: "",
                      reference: "",
                      description: "",
                      installments: false,
                      installmentPlan: "",
                    })
                    // Refresh bookings
                    const data = analyticsManager.getData()
                    const pendingBookings = data.bookings.filter((booking) => booking.paymentStatus === "pending")
                    setBookings(pendingBookings)
                  }}
                >
                  New Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Process payments using Cameroon payment methods</p>
        </div>

        <form onSubmit={handlePayment}>
          {/* Booking Selection */}
          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Select Booking</CardTitle>
              <CardDescription>Choose a booking to process payment for</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={paymentData.selectedBooking} onValueChange={handleBookingSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map((booking) => {
                    const data = analyticsManager.getData()
                    const couple = data.couples.find((c) => c.id === booking.coupleId)
                    const vendor = data.vendors.find((v) => v.id === booking.vendorId)
                    return (
                      <SelectItem key={booking.id} value={booking.id}>
                        {couple?.names.join(" & ")} - {vendor?.businessName} ({booking.serviceType}) -{" "}
                        {booking.amount.toLocaleString()} FCFA
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {bookings.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No pending bookings found. Please create bookings first in the Vendor Selection section.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={paymentData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    placeholder="Client's full name"
                    required
                    disabled={!!paymentData.selectedBooking}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone Number *</Label>
                  <Input
                    id="clientPhone"
                    value={paymentData.clientPhone}
                    onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    required
                    disabled={!!paymentData.selectedBooking}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={paymentData.clientEmail}
                  onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                  placeholder="email@example.com"
                  disabled={!!paymentData.selectedBooking}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    value={paymentData.serviceType}
                    onChange={(e) => handleInputChange("serviceType", e.target.value)}
                    placeholder="Service type"
                    required
                    disabled={!!paymentData.selectedBooking}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor</Label>
                  <Input
                    id="vendorName"
                    value={paymentData.vendorName}
                    onChange={(e) => handleInputChange("vendorName", e.target.value)}
                    placeholder="Vendor name"
                    disabled={!!paymentData.selectedBooking}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (FCFA) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    placeholder="500000"
                    required
                    disabled={!!paymentData.selectedBooking}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    value={paymentData.reference}
                    onChange={(e) => handleInputChange("reference", e.target.value)}
                    placeholder="Order reference"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={paymentData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Service or product description"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentData.paymentMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("paymentMethod", method.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mb-2`}>
                        <method.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm font-medium">{method.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Money Fields */}
              {(paymentData.paymentMethod === "orange" || paymentData.paymentMethod === "mtn") && (
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Phone Number *</Label>
                  <Input
                    id="mobileNumber"
                    value={paymentData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    required
                  />
                </div>
              )}

              {/* Bank Transfer Fields */}
              {paymentData.paymentMethod === "bank" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank *</Label>
                      <Select
                        value={paymentData.bankName}
                        onValueChange={(value) => handleInputChange("bankName", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {cameroonBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={paymentData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        placeholder="Bank account number"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              {paymentData.amount && paymentData.paymentMethod && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{Number(paymentData.amount).toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-medium">
                        {paymentMethods.find((m) => m.id === paymentData.paymentMethod)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction fee:</span>
                      <span className="font-medium">
                        {paymentData.paymentMethod === "cash" ? "0 FCFA" : "2,500 FCFA"}
                      </span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        {(
                          Number(paymentData.amount) + (paymentData.paymentMethod === "cash" ? 0 : 2500)
                        ).toLocaleString()}{" "}
                        FCFA
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !paymentData.amount || !paymentData.paymentMethod}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {loading ? "Processing..." : "Process Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
