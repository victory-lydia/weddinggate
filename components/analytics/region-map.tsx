"use client"

import { useEffect, useRef } from "react"

interface RegionData {
  name: string
  value: number
}

interface RegionMapProps {
  data: RegionData[]
}

export function RegionMap({ data }: RegionMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Check if all values are zero
    const hasData = data.some((region) => region.value > 0)

    // Draw a simplified map of Cameroon with regions
    const regions = [
      {
        name: "Far North",
        path: [200, 50, 250, 50, 270, 100, 230, 150, 180, 120],
        color: hasData ? getRegionColor("Far North") : "#e5e7eb",
      },
      {
        name: "North",
        path: [180, 120, 230, 150, 250, 200, 200, 220, 150, 180],
        color: hasData ? getRegionColor("North") : "#e5e7eb",
      },
      {
        name: "Adamawa",
        path: [150, 180, 200, 220, 220, 270, 170, 280, 130, 230],
        color: hasData ? getRegionColor("Adamawa") : "#e5e7eb",
      },
      {
        name: "Northwest",
        path: [100, 200, 150, 180, 130, 230, 80, 240],
        color: hasData ? getRegionColor("Northwest") : "#e5e7eb",
      },
      {
        name: "Southwest",
        path: [50, 250, 80, 240, 100, 280, 30, 300],
        color: hasData ? getRegionColor("Southwest") : "#e5e7eb",
      },
      {
        name: "West",
        path: [130, 230, 170, 280, 150, 320, 100, 280],
        color: hasData ? getRegionColor("West") : "#e5e7eb",
      },
      {
        name: "Centre",
        path: [170, 280, 220, 270, 250, 320, 200, 350, 150, 320],
        color: hasData ? getRegionColor("Centre") : "#e5e7eb",
      },
      {
        name: "Littoral",
        path: [100, 280, 150, 320, 120, 350, 70, 320],
        color: hasData ? getRegionColor("Littoral") : "#e5e7eb",
      },
      {
        name: "South",
        path: [150, 320, 200, 350, 180, 400, 120, 380],
        color: hasData ? getRegionColor("South") : "#e5e7eb",
      },
      {
        name: "East",
        path: [220, 270, 300, 280, 320, 350, 250, 380, 200, 350, 250, 320],
        color: hasData ? getRegionColor("East") : "#e5e7eb",
      },
    ]

    // Draw each region
    regions.forEach((region) => {
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(region.path[0], region.path[1])

      for (let i = 2; i < region.path.length; i += 2) {
        ctx.lineTo(region.path[i], region.path[i + 1])
      }

      ctx.closePath()
      ctx.fillStyle = region.color
      ctx.fill()

      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Add region name
      const centerX = region.path.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0) / (region.path.length / 2)
      const centerY = region.path.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0) / (region.path.length / 2)

      ctx.font = "10px Arial"
      ctx.fillStyle = hasData ? "#ffffff" : "#9ca3af"
      ctx.textAlign = "center"
      ctx.fillText(region.name, centerX, centerY)
    })

    // Draw legend or no data message
    const legendX = 400
    const legendY = 100

    ctx.font = "14px Arial"
    ctx.fillStyle = "#000000"
    ctx.textAlign = "left"

    if (hasData) {
      ctx.fillText("Bookings by Region", legendX, legendY - 20)

      data
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .forEach((region, index) => {
          const y = legendY + index * 25

          ctx.fillStyle = getRegionColor(region.name)
          ctx.fillRect(legendX, y, 15, 15)

          ctx.fillStyle = "#000000"
          ctx.fillText(`${region.name}: ${region.value}`, legendX + 25, y + 12)
        })
    } else {
      ctx.fillStyle = "#6b7280"
      ctx.fillText("No Regional Data", legendX, legendY)
      ctx.font = "12px Arial"
      ctx.fillText("Data will appear here once", legendX, legendY + 25)
      ctx.fillText("bookings are made", legendX, legendY + 45)
    }
  }, [data])

  // Function to get color based on region value
  function getRegionColor(regionName: string): string {
    const region = data.find((r) => r.name === regionName)
    if (!region) return "#cccccc"

    const maxValue = Math.max(...data.map((r) => r.value))
    const minValue = Math.min(...data.map((r) => r.value))
    const range = maxValue - minValue

    const normalizedValue = (region.value - minValue) / (range || 1)

    // Color gradient from light to dark purple
    const r = Math.floor(158 - normalizedValue * 100)
    const g = Math.floor(127 - normalizedValue * 100)
    const b = Math.floor(216 - normalizedValue * 50)

    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
