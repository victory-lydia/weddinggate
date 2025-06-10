"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navigation/navbar"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { Calendar, ExternalLink } from "lucide-react"
import { analyticsManager } from "@/lib/analytics"

interface Question {
  id: number
  text: string
  options: { text: string; value: number }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "Do you currently spend 3+ hours per week managing vendor communications?",
    options: [
      { text: "Yes, it's a significant time drain", value: 1 },
      { text: "No, vendor communication is manageable", value: 0 },
    ],
  },
  {
    id: 2,
    text: "Do you struggle with keeping track of client preferences and details across multiple events?",
    options: [
      { text: "Yes, I often lose track of details", value: 1 },
      { text: "No, I have a system that works", value: 0 },
    ],
  },
  {
    id: 3,
    text: "Are you currently using 3+ different tools (like Excel, WhatsApp, Google Drive) to manage events?",
    options: [
      { text: "Yes, and it's frustrating to switch between them", value: 1 },
      { text: "No, I use one or two main tools", value: 0 },
    ],
  },
  {
    id: 4,
    text: "Have you ever missed a deadline or important detail because it wasn't properly tracked?",
    options: [
      { text: "Yes, it's happened before", value: 1 },
      { text: "No, I have reliable tracking systems", value: 0 },
    ],
  },
  {
    id: 5,
    text: "Would you benefit from having all client information, vendor contacts, and event details in one place?",
    options: [
      { text: "Yes, that would save me significant time", value: 1 },
      { text: "No, my current system works fine", value: 0 },
    ],
  },
  {
    id: 6,
    text: "Do you manage 5+ weddings/events per month?",
    options: [
      { text: "Yes, and it's overwhelming at times", value: 1 },
      { text: "No, I handle fewer events", value: 0 },
    ],
  },
  {
    id: 7,
    text: "Would you pay for a tool that could save you 5+ hours per week on admin tasks?",
    options: [
      { text: "Yes, if it actually saved me time", value: 1 },
      { text: "No, I prefer my current methods", value: 0 },
    ],
  },
]

export default function DiagnosticPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculateResults = () => {
    const score = Object.values(answers).reduce((sum, value) => sum + value, 0)
    const percentage = Math.round((score / 7) * 100)
    return { score, percentage }
  }

  const getResultData = (percentage: number) => {
    if (percentage >= 85) {
      return {
        title: "Perfect Fit!",
        description:
          "WeddingGate could save you 5-10 hours per week based on your answers! You're experiencing exactly the pain points we solve.",
        recommendations: [
          "Join our priority waitlist for early access",
          "Schedule a demo to see how WeddingGate works",
          "Start planning your onboarding process",
        ],
        colorClass: "bg-gradient-to-t from-green-500 to-green-400",
        cardClass: "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500",
      }
    } else if (percentage >= 50) {
      return {
        title: "Good Potential Fit",
        description:
          "WeddingGate could help streamline parts of your workflow. You might benefit most from our vendor management and client tracking features.",
        recommendations: [
          "Try our free tools for vendor management",
          "Attend a webinar to see if it fits your needs",
          "Follow our blog for planning tips",
        ],
        colorClass: "bg-gradient-to-t from-yellow-500 to-yellow-400",
        cardClass: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-500",
      }
    } else {
      return {
        title: "Limited Fit",
        description:
          "Based on your answers, your current workflow might not need WeddingGate yet. We recommend checking back when you're managing more events or feeling more pain with vendor coordination.",
        recommendations: [
          "Follow us to see new features as we launch them",
          "Download our free event planning templates",
          "Join our Facebook group for planners",
        ],
        colorClass: "bg-gradient-to-t from-red-500 to-red-400",
        cardClass: "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500",
      }
    }
  }

  const handleSubmitResults = () => {
    const { score, percentage } = calculateResults()

    // Get vendor info from localStorage if available
    const vendorInfo = localStorage.getItem("vendor-info")
    let vendorType = "unknown"
    let location = "unknown"

    if (vendorInfo) {
      try {
        const parsed = JSON.parse(vendorInfo)
        vendorType = parsed.vendorType || "unknown"
        location = parsed.location || "unknown"
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Save diagnostic result to analytics
    analyticsManager.addDiagnosticResult({
      userId: user?.id || "anonymous",
      score,
      percentage,
      vendorType,
      location,
    })

    setShowResults(true)
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / 7) * 100
  const canSubmit = answeredCount === 7

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (showResults) {
    const { percentage } = calculateResults()
    const resultData = getResultData(percentage)

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-8 rounded-lg text-center mb-8">
            <h1 className="font-playfair text-3xl font-bold mb-4">WeddingGate Fit Assessment</h1>
            <p className="text-lg opacity-90">Find out if WeddingGate is right for your event planning business</p>
          </div>

          {/* Results */}
          <Card className={`${resultData.cardClass} shadow-lg`}>
            <CardContent className="p-8 text-center">
              <h2 className="font-playfair text-2xl font-bold mb-6">{resultData.title}</h2>

              {/* Test Tube Visualization */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-16 h-40 bg-gray-200 rounded-b-full border-4 border-gray-600 overflow-hidden mb-4">
                  {/* Test tube cap */}
                  <div className="absolute -top-4 -left-2 w-20 h-4 bg-gray-600 rounded-t-md"></div>
                  {/* Liquid fill */}
                  <div
                    className={`absolute bottom-0 w-full rounded-b-full transition-all duration-1000 ease-out ${resultData.colorClass}`}
                    style={{ height: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-4xl font-bold text-gray-800">{percentage}%</div>
              </div>

              <p className="text-lg text-gray-700 mb-6">{resultData.description}</p>

              {/* Recommendations */}
              <div className="text-left mb-8">
                <h3 className="font-semibold text-xl mb-4 text-center">Recommended Next Steps:</h3>
                <ul className="space-y-3">
                  {resultData.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-rose-600 text-xl mr-3">•</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open("https://calendly.com/victorylydiaexcelhalleluyah/30min", "_blank")}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Free Consultation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setShowResults(false)
                    setAnswers({})
                  }}
                >
                  Retake Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-8 rounded-lg text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold mb-4">WeddingGate Fit Assessment</h1>
          <p className="text-lg opacity-90">Find out if WeddingGate is right for your event planning business</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-rose-600 to-pink-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {answeredCount} of {questions.length} questions completed
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((question) => (
            <Card key={question.id} className="border-l-4 border-l-rose-600 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {question.id}. {question.text}
                </h3>
                <RadioGroup
                  value={answers[question.id]?.toString() || ""}
                  onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
                  className="space-y-3"
                >
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <RadioGroupItem value={option.value.toString()} id={`q${question.id}-${index}`} />
                      <Label htmlFor={`q${question.id}-${index}`} className="cursor-pointer flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={handleSubmitResults}
            disabled={!canSubmit}
            className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            See My Results
          </Button>
        </div>
      </div>
    </div>
  )
}
