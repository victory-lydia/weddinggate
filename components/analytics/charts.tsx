"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  name: string
  [key: string]: any
}

interface AreaChartProps {
  data: ChartData[]
  xField: string
  yField: string
  color?: string
  formatY?: (value: number) => string
}

export function AreaChart({ data, xField, yField, color = "#3b82f6", formatY }: AreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

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
    const padding = { top: 20, right: 20, bottom: 40, left: 60 }

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate chart dimensions
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find min and max values
    const values = data.map((d) => d[yField])
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue

    // Draw grid lines
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= data.length - 1; i++) {
      const x = padding.left + (chartWidth / (data.length - 1)) * i
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    }

    // Draw area
    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const y = padding.top + chartHeight - ((point[yField] - minValue) / valueRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Close the area path
    const lastX = padding.left + chartWidth
    const firstX = padding.left
    ctx.lineTo(lastX, padding.top + chartHeight)
    ctx.lineTo(firstX, padding.top + chartHeight)
    ctx.closePath()

    // Fill area
    ctx.fillStyle = color + "20"
    ctx.fill()

    // Draw line
    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const y = padding.top + chartHeight - ((point[yField] - minValue) / valueRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points
    ctx.fillStyle = color
    data.forEach((point, index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const y = padding.top + chartHeight - ((point[yField] - minValue) / valueRange) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // X-axis labels
    data.forEach((point, index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      ctx.fillText(point[xField], x, height - 10)
    })

    // Y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange / 5) * (5 - i)
      const y = padding.top + (chartHeight / 5) * i + 4
      const label = formatY ? formatY(value) : value.toLocaleString()
      ctx.fillText(label, padding.left - 10, y)
    }
  }, [data, xField, yField, color, formatY])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

interface BarChartProps {
  data: ChartData[]
  xField: string
  yField: string
  color?: string
}

export function BarChart({ data, xField, yField, color = "#3b82f6" }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

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
    const padding = { top: 20, right: 20, bottom: 40, left: 60 }

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate chart dimensions
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find max value
    const maxValue = Math.max(...data.map((d) => d[yField]))

    // Calculate bar width
    const barWidth = (chartWidth / data.length) * 0.8
    const barSpacing = (chartWidth / data.length) * 0.2

    // Draw bars
    data.forEach((point, index) => {
      const barHeight = (point[yField] / maxValue) * chartHeight
      const x = padding.left + index * (chartWidth / data.length) + barSpacing / 2
      const y = padding.top + chartHeight - barHeight

      // Draw bar
      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top of bar
      ctx.fillStyle = "#374151"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(point[yField].toString(), x + barWidth / 2, y - 5)
    })

    // Draw labels
    ctx.fillStyle = "#6b7280"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // X-axis labels
    data.forEach((point, index) => {
      const x = padding.left + index * (chartWidth / data.length) + chartWidth / data.length / 2
      ctx.fillText(point[xField], x, height - 10)
    })

    // Y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * (5 - i)
      const y = padding.top + (chartHeight / 5) * i + 4
      ctx.fillText(Math.round(value).toString(), padding.left - 10, y)
    }

    // Draw grid lines
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }
  }, [data, xField, yField, color])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>
  nameField: string
  valueField: string
}

export function DonutChart({ data, nameField, valueField }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F", "#FFBB28", "#FF8042"]

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

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

    // Calculate total value
    const total = data.reduce((sum, item) => sum + item[valueField], 0)

    // Chart dimensions
    const centerX = width * 0.4
    const centerY = height / 2
    const outerRadius = Math.min(width, height) * 0.25
    const innerRadius = outerRadius * 0.6

    // If total is 0, draw a gray circle to show empty state
    if (total === 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI)
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true)
      ctx.fillStyle = "#e5e7eb"
      ctx.fill()

      // Draw center text for empty state
      ctx.fillStyle = "#6b7280"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("No Data", centerX, centerY - 5)
      ctx.fillText("Available", centerX, centerY + 15)
    } else {
      // Draw donut segments
      let currentAngle = -Math.PI / 2

      data.forEach((item, index) => {
        const sliceAngle = (item[valueField] / total) * 2 * Math.PI
        const color = item.color || colors[index % colors.length]

        // Draw slice
        ctx.beginPath()
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle)
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()

        currentAngle += sliceAngle
      })

      // Draw center text
      ctx.fillStyle = "#374151"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Total", centerX, centerY - 5)
      ctx.fillText(total.toString(), centerX, centerY + 15)
    }

    // Draw legend
    const legendX = width * 0.65
    let legendY = height * 0.2

    ctx.font = "14px Arial"
    ctx.textAlign = "left"

    data.forEach((item, index) => {
      const color = item.color || colors[index % colors.length]

      // Draw color box
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY, 15, 15)

      // Draw text
      ctx.fillStyle = "#374151"
      ctx.fillText(`${item[nameField]}: ${item[valueField]}`, legendX + 25, legendY + 12)

      legendY += 25
    })
  }, [data, nameField, valueField])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
