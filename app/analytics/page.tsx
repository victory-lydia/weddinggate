"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Download,
  Filter,
  Map,
  Heart,
  Database,
  Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { AreaChart, BarChart, DonutChart } from "@/components/analytics/charts"
import { MetricCard } from "@/components/analytics/metric-card"
import { DataTable } from "@/components/analytics/data-table"
import { RegionMap } from "@/components/analytics/region-map"
import { analyticsManager } from "@/lib/analytics"

export default function AnalyticsPage() {
  const [data, setData] = useState({
    revenueData: [],
    bookingsData: [],
    vendorCategories: [],
    regionsData: [],
    recentBookings: [],
    metrics: {
      totalRevenue: 0,
      totalBookings: 0,
      activeVendors: 0,
      conversionRate: 0,
      averageBookingValue: 0,
      customerSatisfaction: 0,
    },
  })
  const [timeRange, setTimeRange] = useState("12m")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const { toast } = useToast()
  const { user } = useAuth()

  // Load data from analytics manager
  const loadData = () => {
    const metrics = analyticsManager.getMetrics()
    const revenueData = analyticsManager.getMonthlyRevenue()
    const bookingsData = analyticsManager.getMonthlyBookings()
    const vendorCategories = analyticsManager.getVendorCategories()
    const regionsData = analyticsManager.getRegionalData()
    const recentBookings = analyticsManager.getRecentBookings()

    setData({
      revenueData,
      bookingsData,
      vendorCategories,
      regionsData,
      recentBookings,
      metrics,
    })
  }

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      loadData()
      setLastUpdated(new Date())
      setIsLoading(false)

      toast({
        title: "Dashboard refreshed",
        description: `Data updated as of ${new Date().toLocaleTimeString()}`,
      })
    }, 1500)
  }

  // Add sample data for demonstration
  const addSampleData = () => {
    analyticsManager.addSampleData()
    loadData()
    toast({
      title: "Sample data added",
      description: "Dashboard now shows sample wedding data for demonstration.",
    })
  }

  // Clear all data
  const clearData = () => {
    analyticsManager.clearData()
    loadData()
    toast({
      title: "Data cleared",
      description: "All analytics data has been reset.",
    })
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Auto refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        loadData()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const hasData = data.metrics.totalBookings > 0 || data.metrics.activeVendors > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time insights for your wedding planning business</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <div className="flex items-center">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>

              <Button variant="outline" onClick={addSampleData}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sample Data
              </Button>

              <Button variant="outline" onClick={clearData}>
                <Database className="h-4 w-4 mr-2" />
                Clear Data
              </Button>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button>
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Last updated */}
        <div className="text-sm text-gray-500 mb-6">
          Last updated: {lastUpdated.toLocaleString()}
          <Badge variant="outline" className="ml-2">
            Real-time
          </Badge>
          {hasData && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
              Live Data
            </Badge>
          )}
        </div>

        {/* No Data State */}
        {!hasData && (
          <Card className="mb-8 border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-4">
                Start using Wedding Gate to see analytics data. Register couples, vendors, and process bookings to
                populate this dashboard.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={addSampleData}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sample Data
                </Button>
                <Button variant="outline" asChild>
                  <a href="/operations">Go to Operations</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(data.metrics.totalRevenue)}
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            trend={0}
            description="vs. previous period"
          />

          <MetricCard
            title="Total Bookings"
            value={data.metrics.totalBookings.toString()}
            icon={<Calendar className="h-5 w-5 text-blue-600" />}
            trend={0}
            description="vs. previous period"
          />

          <MetricCard
            title="Active Vendors"
            value={data.metrics.activeVendors.toString()}
            icon={<Users className="h-5 w-5 text-purple-600" />}
            trend={0}
            description="vs. previous period"
          />

          <MetricCard
            title="Conversion Rate"
            value={`${data.metrics.conversionRate}%`}
            icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
            trend={0}
            description="vs. previous period"
          />

          <MetricCard
            title="Avg. Booking Value"
            value={formatCurrency(data.metrics.averageBookingValue)}
            icon={<Heart className="h-5 w-5 text-rose-600" />}
            trend={0}
            description="vs. previous period"
          />

          <MetricCard
            title="Customer Satisfaction"
            value={`${data.metrics.customerSatisfaction}%`}
            icon={<Heart className="h-5 w-5 text-red-600" />}
            trend={0}
            description="vs. previous period"
          />
        </div>

        {/* Tabs for different dashboard views */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                    Revenue Trend
                  </CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart
                    data={data.revenueData}
                    xField="name"
                    yField="revenue"
                    color="#3b82f6"
                    formatY={(value) => formatCurrency(value)}
                  />
                </CardContent>
              </Card>

              {/* Bookings Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Bookings Trend
                  </CardTitle>
                  <CardDescription>Monthly bookings over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={data.bookingsData} xField="name" yField="bookings" color="#22c55e" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Vendor Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                    Vendor Categories
                  </CardTitle>
                  <CardDescription>Distribution by vendor type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <DonutChart data={data.vendorCategories} nameField="name" valueField="value" />
                </CardContent>
              </Card>

              {/* Regional Distribution */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Map className="h-5 w-5 mr-2 text-rose-600" />
                    Regional Distribution
                  </CardTitle>
                  <CardDescription>Bookings by region in Cameroon</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <RegionMap data={data.regionsData} />
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Bookings
                </CardTitle>
                <CardDescription>Latest wedding bookings across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {data.recentBookings.length > 0 ? (
                  <DataTable data={data.recentBookings} formatCurrency={formatCurrency} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No bookings yet</p>
                    <p className="text-sm">Bookings will appear here once couples start using the platform</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs remain the same... */}
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Detailed revenue breakdown and trends</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <AreaChart
                    data={data.revenueData}
                    xField="name"
                    yField="revenue"
                    color="#10b981"
                    formatY={(value) => formatCurrency(value)}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Revenue distribution across vendor categories</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <DonutChart data={data.vendorCategories} nameField="name" valueField="value" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Monthly booking patterns and growth</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={data.bookingsData} xField="name" yField="bookings" color="#3b82f6" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable data={data.recentBookings.slice(0, 5)} formatCurrency={formatCurrency} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vendors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Distribution</CardTitle>
                  <CardDescription>Breakdown of vendor types</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <DonutChart data={data.vendorCategories} nameField="name" valueField="value" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Performance</CardTitle>
                  <CardDescription>Top performing vendor categories</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={data.vendorCategories} xField="name" yField="value" color="#8b5cf6" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regions">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Analysis</CardTitle>
                  <CardDescription>Wedding bookings across Cameroon regions</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <RegionMap data={data.regionsData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
