// Analytics data management
export interface AnalyticsData {
  couples: CoupleData[]
  vendors: VendorData[]
  bookings: BookingData[]
  payments: PaymentData[]
  diagnosticResults: DiagnosticData[]
}

export interface CoupleData {
  id: string
  names: string[]
  email: string
  phone: string[]
  region: string
  city: string
  weddingDate: string
  budget: number
  guestCount: number
  registrationDate: string
  status: "active" | "planning" | "completed"
}

export interface VendorData {
  id: string
  businessName: string
  category: string
  region: string
  city: string
  email: string
  phone: string
  registrationDate: string
  status: "active" | "pending" | "verified"
  rating: number
  completedBookings: number
}

export interface BookingData {
  id: string
  coupleId: string
  vendorId: string
  serviceType: string
  amount: number
  bookingDate: string
  eventDate: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  region: string
  paymentStatus: "paid" | "pending" | "partial"
}

export interface PaymentData {
  id: string
  bookingId: string
  amount: number
  method: "orange" | "mtn" | "bank" | "cash"
  date: string
  status: "completed" | "pending" | "failed"
  fees: number
}

export interface DiagnosticData {
  id: string
  userId: string
  score: number
  percentage: number
  completedDate: string
  vendorType: string
  location: string
}

// Analytics storage and retrieval
class AnalyticsManager {
  private storageKey = "wedding-gate-analytics"

  // Get all analytics data
  getData(): AnalyticsData {
    if (typeof window === "undefined") {
      return this.getEmptyData()
    }

    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      return this.getEmptyData()
    }

    try {
      return JSON.parse(stored)
    } catch {
      return this.getEmptyData()
    }
  }

  // Save analytics data
  saveData(data: AnalyticsData): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  // Add new couple registration
  addCouple(couple: Omit<CoupleData, "id" | "registrationDate" | "status">): void {
    const data = this.getData()
    const newCouple: CoupleData = {
      ...couple,
      id: `couple_${Date.now()}`,
      registrationDate: new Date().toISOString(),
      status: "active",
    }
    data.couples.push(newCouple)
    this.saveData(data)
  }

  // Add new vendor registration
  addVendor(vendor: Omit<VendorData, "id" | "registrationDate" | "status" | "rating" | "completedBookings">): void {
    const data = this.getData()
    const newVendor: VendorData = {
      ...vendor,
      id: `vendor_${Date.now()}`,
      registrationDate: new Date().toISOString(),
      status: "pending",
      rating: 0,
      completedBookings: 0,
    }
    data.vendors.push(newVendor)
    this.saveData(data)
  }

  // Add new booking
  addBooking(booking: Omit<BookingData, "id" | "bookingDate" | "status" | "paymentStatus">): void {
    const data = this.getData()
    const newBooking: BookingData = {
      ...booking,
      id: `booking_${Date.now()}`,
      bookingDate: new Date().toISOString(),
      status: "pending",
      paymentStatus: "pending",
    }
    data.bookings.push(newBooking)
    this.saveData(data)
  }

  // Add new payment
  addPayment(payment: Omit<PaymentData, "id" | "date" | "status">): void {
    const data = this.getData()
    const newPayment: PaymentData = {
      ...payment,
      id: `payment_${Date.now()}`,
      date: new Date().toISOString(),
      status: "completed",
    }
    data.payments.push(newPayment)

    // Update booking payment status
    const booking = data.bookings.find((b) => b.id === payment.bookingId)
    if (booking) {
      booking.paymentStatus = "paid"
      booking.status = "confirmed"
    }

    this.saveData(data)
  }

  // Add diagnostic result
  addDiagnosticResult(result: Omit<DiagnosticData, "id" | "completedDate">): void {
    const data = this.getData()
    const newResult: DiagnosticData = {
      ...result,
      id: `diagnostic_${Date.now()}`,
      completedDate: new Date().toISOString(),
    }
    data.diagnosticResults.push(newResult)
    this.saveData(data)
  }

  // Generate analytics metrics
  getMetrics() {
    const data = this.getData()
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    // Calculate total revenue
    const totalRevenue = data.payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

    // Calculate total bookings
    const totalBookings = data.bookings.length

    // Calculate active vendors
    const activeVendors = data.vendors.filter((v) => v.status === "active" || v.status === "verified").length

    // Calculate conversion rate (bookings / couples)
    const conversionRate = data.couples.length > 0 ? (totalBookings / data.couples.length) * 100 : 0

    // Calculate average booking value
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

    // Calculate customer satisfaction (based on completed bookings)
    const completedBookings = data.bookings.filter((b) => b.status === "completed")
    const customerSatisfaction = completedBookings.length > 0 ? 85 : 0 // Mock satisfaction score

    return {
      totalRevenue,
      totalBookings,
      activeVendors,
      conversionRate: Math.round(conversionRate),
      averageBookingValue,
      customerSatisfaction,
    }
  }

  // Generate monthly revenue data
  getMonthlyRevenue() {
    const data = this.getData()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const currentMonth = now.getMonth()

    return months.map((month, i) => {
      const adjustedIndex = (currentMonth - 11 + i) % 12
      const adjustedMonth = months[adjustedIndex >= 0 ? adjustedIndex : adjustedIndex + 12]

      // Calculate revenue for this month
      const monthStart = new Date(now.getFullYear(), adjustedIndex, 1)
      const monthEnd = new Date(now.getFullYear(), adjustedIndex + 1, 0)

      const monthRevenue = data.payments
        .filter((p) => {
          const paymentDate = new Date(p.date)
          return paymentDate >= monthStart && paymentDate <= monthEnd && p.status === "completed"
        })
        .reduce((sum, p) => sum + p.amount, 0)

      return {
        name: adjustedMonth,
        revenue: monthRevenue,
      }
    })
  }

  // Generate monthly bookings data
  getMonthlyBookings() {
    const data = this.getData()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const now = new Date()
    const currentMonth = now.getMonth()

    return months.map((month, i) => {
      const adjustedIndex = (currentMonth - 11 + i) % 12
      const adjustedMonth = months[adjustedIndex >= 0 ? adjustedIndex : adjustedIndex + 12]

      // Calculate bookings for this month
      const monthStart = new Date(now.getFullYear(), adjustedIndex, 1)
      const monthEnd = new Date(now.getFullYear(), adjustedIndex + 1, 0)

      const monthBookings = data.bookings.filter((b) => {
        const bookingDate = new Date(b.bookingDate)
        return bookingDate >= monthStart && bookingDate <= monthEnd
      }).length

      return {
        name: adjustedMonth,
        bookings: monthBookings,
      }
    })
  }

  // Generate vendor categories data
  getVendorCategories() {
    const data = this.getData()
    const categories = [
      { name: "Photographer", value: 0, color: "#8884d8" },
      { name: "Caterer", value: 0, color: "#82ca9d" },
      { name: "Venue", value: 0, color: "#ffc658" },
      { name: "Decorator", value: 0, color: "#ff8042" },
      { name: "Musician", value: 0, color: "#0088fe" },
    ]

    // Count vendors by category
    data.vendors.forEach((vendor) => {
      const category = categories.find(
        (c) =>
          c.name.toLowerCase() === vendor.category.toLowerCase() ||
          vendor.category.toLowerCase().includes(c.name.toLowerCase()),
      )
      if (category) {
        category.value++
      }
    })

    return categories
  }

  // Generate regional data
  getRegionalData() {
    const data = this.getData()
    const regions = [
      { name: "Centre", value: 0 },
      { name: "Littoral", value: 0 },
      { name: "West", value: 0 },
      { name: "Northwest", value: 0 },
      { name: "Southwest", value: 0 },
      { name: "East", value: 0 },
      { name: "South", value: 0 },
      { name: "North", value: 0 },
      { name: "Far North", value: 0 },
      { name: "Adamawa", value: 0 },
    ]

    // Count bookings by region
    data.bookings.forEach((booking) => {
      const region = regions.find((r) => r.name === booking.region)
      if (region) {
        region.value++
      }
    })

    return regions
  }

  // Get recent bookings
  getRecentBookings() {
    const data = this.getData()
    return data.bookings
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      .slice(0, 10)
      .map((booking) => {
        const couple = data.couples.find((c) => c.id === booking.coupleId)
        const vendor = data.vendors.find((v) => v.id === booking.vendorId)

        return {
          id: booking.id,
          couple: couple ? couple.names.join(" & ") : "Unknown Couple",
          vendor: vendor ? vendor.businessName : "Unknown Vendor",
          date: new Date(booking.bookingDate).toLocaleDateString(),
          amount: booking.amount,
          status: booking.status,
          location: booking.region,
        }
      })
  }

  private getEmptyData(): AnalyticsData {
    return {
      couples: [],
      vendors: [],
      bookings: [],
      payments: [],
      diagnosticResults: [],
    }
  }

  // Clear all data (for testing)
  clearData(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.storageKey)
  }

  // Add sample data for testing
  addSampleData(): void {
    const sampleData: AnalyticsData = {
      couples: [
        {
          id: "couple_1",
          names: ["John Doe", "Jane Smith"],
          email: "john.jane@example.com",
          phone: ["+237 677 123 456", "+237 699 987 654"],
          region: "Centre",
          city: "Yaoundé",
          weddingDate: "2024-06-15",
          budget: 5000000,
          guestCount: 150,
          registrationDate: "2024-01-15T10:00:00Z",
          status: "active",
        },
        {
          id: "couple_2",
          names: ["Paul Biya", "Marie Claire"],
          email: "paul.marie@example.com",
          phone: ["+237 655 111 222"],
          region: "Littoral",
          city: "Douala",
          weddingDate: "2024-08-20",
          budget: 8000000,
          guestCount: 200,
          registrationDate: "2024-02-01T14:30:00Z",
          status: "planning",
        },
      ],
      vendors: [
        {
          id: "vendor_1",
          businessName: "Studio Photo Excellence",
          category: "photographer",
          region: "Centre",
          city: "Yaoundé",
          email: "contact@photoexcellence.cm",
          phone: "+237 677 123 456",
          registrationDate: "2024-01-10T09:00:00Z",
          status: "verified",
          rating: 4.8,
          completedBookings: 5,
        },
        {
          id: "vendor_2",
          businessName: "Cameroon Delights Catering",
          category: "caterer",
          region: "Littoral",
          city: "Douala",
          email: "info@cameroondelights.cm",
          phone: "+237 699 987 654",
          registrationDate: "2024-01-20T11:15:00Z",
          status: "active",
          rating: 4.6,
          completedBookings: 8,
        },
      ],
      bookings: [
        {
          id: "booking_1",
          coupleId: "couple_1",
          vendorId: "vendor_1",
          serviceType: "photography",
          amount: 800000,
          bookingDate: "2024-02-15T16:00:00Z",
          eventDate: "2024-06-15",
          status: "confirmed",
          region: "Centre",
          paymentStatus: "paid",
        },
        {
          id: "booking_2",
          coupleId: "couple_2",
          vendorId: "vendor_2",
          serviceType: "catering",
          amount: 2500000,
          bookingDate: "2024-03-01T10:30:00Z",
          eventDate: "2024-08-20",
          status: "confirmed",
          region: "Littoral",
          paymentStatus: "partial",
        },
      ],
      payments: [
        {
          id: "payment_1",
          bookingId: "booking_1",
          amount: 800000,
          method: "orange",
          date: "2024-02-15T16:30:00Z",
          status: "completed",
          fees: 2500,
        },
        {
          id: "payment_2",
          bookingId: "booking_2",
          amount: 1250000,
          method: "bank",
          date: "2024-03-01T11:00:00Z",
          status: "completed",
          fees: 0,
        },
      ],
      diagnosticResults: [
        {
          id: "diagnostic_1",
          userId: "user_1",
          score: 6,
          percentage: 86,
          completedDate: "2024-01-25T14:20:00Z",
          vendorType: "photographer",
          location: "Yaoundé",
        },
      ],
    }

    this.saveData(sampleData)
  }
}

export const analyticsManager = new AnalyticsManager()
