"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart3, Users, Award, Settings, TrendingUp, Calendar, MessageSquare, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"

const adminTools = [
  {
    title: "TOPSIS Evaluation",
    description: "Advanced ranking system for wedding planners using weighted criteria",
    icon: Award,
    href: "/topsis",
    color: "bg-blue-500",
  },
  {
    title: "Analytics Dashboard",
    description: "Comprehensive analytics and reporting for business insights",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "bg-green-500",
  },
  {
    title: "Operations Management",
    description: "Manage system operations and user activities",
    icon: Settings,
    href: "/admin/operations",
    color: "bg-purple-500",
  },
  {
    title: "User Management",
    description: "Manage user accounts, roles, and permissions",
    icon: Users,
    href: "/admin/users",
    color: "bg-orange-500",
  },
  {
    title: "Performance Metrics",
    description: "Track system performance and user engagement",
    icon: TrendingUp,
    href: "/admin/metrics",
    color: "bg-red-500",
  },
  {
    title: "WedChat Management",
    description: "Monitor and manage chat communications",
    icon: MessageSquare,
    href: "/admin/wedchat",
    color: "bg-indigo-500",
  },
]

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !user.email.includes("admin"))) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !user.email.includes("admin")) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="font-playfair text-2xl font-bold text-gray-900">Wedding Gate Admin</h1>
                <p className="text-sm text-gray-600">Administrative Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" onClick={logout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage and monitor the Wedding Gate platform</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900">567</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Assessments</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool) => (
            <Card key={tool.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href={tool.href}>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600">{tool.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/topsis">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Award className="h-4 w-4 mr-2" />
                TOPSIS Tool
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
