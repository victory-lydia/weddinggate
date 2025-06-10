import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: number
  description?: string
}

export function MetricCard({ title, value, icon, trend, description }: MetricCardProps) {
  const isTrendPositive = trend && trend > 0

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>

            {trend !== undefined && (
              <div className="flex items-center mt-2">
                <div className={`flex items-center ${isTrendPositive ? "text-green-600" : "text-red-600"}`}>
                  {isTrendPositive ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{Math.abs(trend)}%</span>
                </div>
                {description && <span className="text-xs text-gray-500 ml-2">{description}</span>}
              </div>
            )}
          </div>

          <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
