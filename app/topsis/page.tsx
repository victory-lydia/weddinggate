"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trash2,
  Plus,
  BarChart3,
  RotateCcw,
  HelpCircle,
  Trophy,
  Target,
  Users,
  Calculator,
  Download,
  Star,
  TrendingUp,
  CheckCircle2,
  BarChart,
} from "lucide-react"
import { Tooltip as RadixTooltip,TooltipContent, TooltipTrigger,TooltipProvider } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { Tooltip } from "@radix-ui/react-tooltip"

interface Question {
  text: string
  weight: number
  tooltip: string
  benefit: boolean
  category: string
}

interface Planner {
  id: string
  name: string
  responses: number[]
  color: string
}

interface TOPSISResult {
  name: string
  rank: number
  closeness: number
  originalValues: number[]
  color: string
  percentage: number
}

const questions: Question[] = [
  {
    text: "Price within couple's budget?",
    weight: 0.2,
    tooltip: "Whether the vendor's pricing aligns with the couple's allocated budget",
    benefit: true,
    category: "Cost",
  },
  {
    text: "Available on wedding date?",
    weight: 0.15,
    tooltip: "Vendor has confirmed availability for the specific wedding date",
    benefit: true,
    category: "Availability",
  },
  {
    text: "Positive reviews (4.5+ stars)?",
    weight: 0.1,
    tooltip: "Vendor has consistently high ratings from previous clients",
    benefit: true,
    category: "Reputation",
  },
  {
    text: "Experience (5+ years)?",
    weight: 0.1,
    tooltip: "Vendor has significant experience in the wedding industry",
    benefit: true,
    category: "Experience",
  },
  {
    text: "Offers customization options?",
    weight: 0.15,
    tooltip: "Ability to tailor services to couple's specific preferences and needs",
    benefit: true,
    category: "Flexibility",
  },
  {
    text: "Requires large deposit (>50%)?",
    weight: 0.1,
    tooltip: "Vendor requires a substantial upfront payment",
    benefit: false,
    category: "Payment Terms",
  },
  {
    text: "Provides liability insurance?",
    weight: 0.1,
    tooltip: "Vendor has proper insurance coverage for their services",
    benefit: true,
    category: "Security",
  },
  {
    text: "Located within 30km of venue?",
    weight: 0.1,
    tooltip: "Vendor's proximity to the wedding venue",
    benefit: true,
    category: "Location",
  },
]

const plannerColors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

export default function TOPSISAnalysis() {
  const [planners, setPlanners] = useState<Planner[]>([])
  const [results, setResults] = useState<TOPSISResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    addPlanner()
  }, [])

  useEffect(() => {
    calculateCompletionPercentage()
  }, [planners])

  useEffect(() => {
    if (results.length > 0) {
      prepareChartData()
    }
  }, [results])

  const prepareChartData = () => {
    console.log("Preparing chart data from results:", results)

    if (!results || results.length === 0) {
      console.log("No results available for chart")
      setChartData([])
      return
    }

    // Create chart data with better error handling
    const data = results.map((result, index) => {
      const chartItem = {
        name: result.name || `Vendor ${index + 1}`,
        score: Number(result.closeness) || 0,
        color: result.color || plannerColors[index % plannerColors.length],
        rank: result.rank || index + 1,
      }
      console.log("Chart item:", chartItem)
      return chartItem
    })

    console.log("Final chart data:", data)
    setChartData(data)
  }

  const calculateCompletionPercentage = () => {
    if (planners.length === 0) {
      setCompletionPercentage(0)
      return
    }

    const totalQuestions = planners.length * questions.length
    const answeredQuestions = planners.reduce((total, planner) => {
      return total + planner.responses.filter((r) => r !== -1).length
    }, 0)

    setCompletionPercentage((answeredQuestions / totalQuestions) * 100)
  }

  const addPlanner = () => {
    const newPlanner: Planner = {
      id: Date.now().toString(),
      name: `Vendor ${planners.length + 1}`,
      responses: new Array(questions.length).fill(-1),
      color: plannerColors[planners.length % plannerColors.length],
    }
    setPlanners([...planners, newPlanner])
  }

  const removePlanner = (id: string) => {
    if (planners.length <= 1) {
      alert("You need at least one vendor")
      return
    }
    setPlanners(planners.filter((p) => p.id !== id))
  }

  const updatePlannerName = (id: string, name: string) => {
    setPlanners(planners.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  const updateResponse = (plannerId: string, questionIndex: number, value: number) => {
    setPlanners(
      planners.map((p) =>
        p.id === plannerId ? { ...p, responses: p.responses.map((r, i) => (i === questionIndex ? value : r)) } : p,
      ),
    )
  }

  const validateResponses = (): boolean => {
    for (const planner of planners) {
      for (let i = 0; i < questions.length; i++) {
        if (planner.responses[i] === -1) {
          alert(`Please answer all questions for ${planner.name}`)
          return false
        }
      }
    }
    return true
  }

  const runTOPSIS = async () => {
    if (!validateResponses()) return

    setIsAnalyzing(true)
    setCurrentStep(2)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Step 1: Create decision matrix
      const decisionMatrix = planners.map((p) => p.responses)
      console.log("Decision Matrix:", decisionMatrix)

      // Step 2: Normalize the decision matrix
      const normalizedMatrix = normalizeMatrix(decisionMatrix)
      console.log("Normalized Matrix:", normalizedMatrix)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 3: Calculate weighted normalized decision matrix
      const weightedMatrix = calculateWeightedMatrix(normalizedMatrix)
      console.log("Weighted Matrix:", weightedMatrix)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 4: Determine ideal and negative-ideal solutions
      const { idealSolution, negativeIdealSolution } = determineIdealSolutions(weightedMatrix)
      console.log("Ideal Solution:", idealSolution)
      console.log("Negative Ideal Solution:", negativeIdealSolution)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 5: Calculate separation measures
      const separationMeasures = calculateSeparationMeasures(weightedMatrix, idealSolution, negativeIdealSolution)
      console.log("Separation Measures:", separationMeasures)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 6: Calculate relative closeness to ideal solution
      const closenessScores = separationMeasures.map((measure, index) => {
        const totalDistance = measure.distanceToIdeal + measure.distanceToNegativeIdeal
        console.log(
          `Vendor ${index}: distanceToIdeal=${measure.distanceToIdeal}, distanceToNegativeIdeal=${measure.distanceToNegativeIdeal}, total=${totalDistance}`,
        )

        if (totalDistance === 0 || isNaN(totalDistance)) {
          return 0.5 // Neutral score if no variation
        }

        const closeness = measure.distanceToNegativeIdeal / totalDistance
        return isNaN(closeness) ? 0 : closeness
      })

      console.log("Closeness Scores:", closenessScores)

      // Step 7: Create results with proper validation
      const topsisResults: TOPSISResult[] = planners.map((planner, i) => {
        const closeness = closenessScores[i]
        const percentage = closeness * 100

        return {
          name: planner.name,
          rank: 0,
          closeness: closeness,
          originalValues: [...planner.responses],
          color: planner.color,
          percentage: percentage,
        }
      })

      // Sort by closeness score (descending) and assign ranks
      topsisResults.sort((a, b) => b.closeness - a.closeness)
      topsisResults.forEach((result, i) => {
        result.rank = i + 1
      })

      console.log("Final Results:", topsisResults)

      setResults(topsisResults)
      setShowResults(true)
      setCurrentStep(3)
      setIsAnalyzing(false)
    } catch (error) {
      console.error("TOPSIS calculation error:", error)
      alert("Error in TOPSIS calculation. Please check your data and try again.")
      setIsAnalyzing(false)
    }
  }

  // TOPSIS calculation functions (same as before)
  const normalizeMatrix = (matrix: number[][]): number[][] => {
    const numCriteria = questions.length
    const numAlternatives = matrix.length

    // Calculate the sum of squares for each criterion
    const sumsOfSquares = new Array(numCriteria).fill(0)

    for (let j = 0; j < numCriteria; j++) {
      for (let i = 0; i < numAlternatives; i++) {
        sumsOfSquares[j] += Math.pow(matrix[i][j], 2)
      }
    }

    // Normalize each element
    const normalizedMatrix: number[][] = []
    for (let i = 0; i < numAlternatives; i++) {
      const normalizedRow: number[] = []
      for (let j = 0; j < numCriteria; j++) {
        const denominator = Math.sqrt(sumsOfSquares[j])
        if (denominator === 0) {
          normalizedRow.push(0)
        } else {
          normalizedRow.push(matrix[i][j] / denominator)
        }
      }
      normalizedMatrix.push(normalizedRow)
    }

    return normalizedMatrix
  }

  const calculateWeightedMatrix = (normalizedMatrix: number[][]): number[][] => {
    return normalizedMatrix.map((row) => row.map((value, i) => value * questions[i].weight))
  }

  const determineIdealSolutions = (weightedMatrix: number[][]) => {
    const idealSolution: number[] = []
    const negativeIdealSolution: number[] = []

    questions.forEach((q, i) => {
      const values = weightedMatrix.map((row) => row[i])
      if (q.benefit) {
        idealSolution.push(Math.max(...values))
        negativeIdealSolution.push(Math.min(...values))
      } else {
        idealSolution.push(Math.min(...values))
        negativeIdealSolution.push(Math.max(...values))
      }
    })

    return { idealSolution, negativeIdealSolution }
  }

  const calculateSeparationMeasures = (
    weightedMatrix: number[][],
    idealSolution: number[],
    negativeIdealSolution: number[],
  ) => {
    return weightedMatrix.map((row, index) => {
      let distanceToIdeal = 0
      let distanceToNegativeIdeal = 0

      row.forEach((value, j) => {
        // Calculate squared differences
        const diffIdeal = Math.pow(value - idealSolution[j], 2)
        const diffNegative = Math.pow(value - negativeIdealSolution[j], 2)

        distanceToIdeal += diffIdeal
        distanceToNegativeIdeal += diffNegative
      })

      // Take square root to get Euclidean distance
      distanceToIdeal = Math.sqrt(distanceToIdeal)
      distanceToNegativeIdeal = Math.sqrt(distanceToNegativeIdeal)

      console.log(`Alternative ${index}: D+ = ${distanceToIdeal}, D- = ${distanceToNegativeIdeal}`)

      return {
        distanceToIdeal: isNaN(distanceToIdeal) ? 0 : distanceToIdeal,
        distanceToNegativeIdeal: isNaN(distanceToNegativeIdeal) ? 0 : distanceToNegativeIdeal,
      }
    })
  }

  const resetAll = () => {
    if (confirm("Are you sure you want to reset all vendors and results?")) {
      setPlanners([])
      setResults([])
      setShowResults(false)
      setCurrentStep(1)
      addPlanner()
    }
  }

  const exportResults = () => {
    const csvContent = [
      ["Rank", "Vendor", "Closeness Score", "Percentage", ...questions.map((_, i) => `Q${i + 1}`)],
      ...results.map((result) => [
        result.rank,
        result.name,
        result.closeness.toFixed(4),
        result.percentage.toFixed(1) + "%",
        ...result.originalValues,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "topsis-vendor-analysis.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vendor Selection Tool
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Multi-criteria decision analysis for comparing wedding vendors using TOPSIS methodology
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              {[
                { step: 1, title: "Setup", icon: Users },
                { step: 2, title: "Analysis", icon: Calculator },
                { step: 3, title: "Results", icon: Trophy },
              ].map(({ step, title, icon: Icon }) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${
                      currentStep >= step ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`font-medium ${currentStep >= step ? "text-blue-600" : "text-gray-500"}`}>
                    {title}
                  </span>
                  {step < 3 && <div className="w-8 h-0.5 bg-gray-300" />}
                </div>
              ))}
            </div>

            {completionPercentage > 0 && completionPercentage < 100 && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion Progress</span>
                  <span>{completionPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            )}
          </motion.div>

          {/* Analysis Loading */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <Card className="p-8 max-w-md">
                  <div className="text-center space-y-4">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
                    <h3 className="text-xl font-semibold">Running TOPSIS Analysis</h3>
                    <p className="text-muted-foreground">Processing multi-criteria decision matrix...</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="grid gap-6">
            {/* Criteria Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Evaluation Criteria
                  </CardTitle>
                  <CardDescription>Eight weighted criteria for comprehensive vendor assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {questions.map((question, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={question.benefit ? "default" : "secondary"}>{question.category}</Badge>
                          <span className="text-sm font-medium text-blue-600">
                            {(question.weight * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">Q{index + 1}</p>
                        <p className="text-sm text-muted-foreground">{question.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comparison Matrix */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Vendor Comparison Matrix
                  </CardTitle>
                  <CardDescription>Answer all questions for each vendor to enable analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-left min-w-[350px] rounded-tl-lg">
                            Questions & Criteria
                          </th>
                          {planners.map((planner, index) => (
                            <th
                              key={planner.id}
                              className={`border p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white min-w-[200px] ${
                                index === planners.length - 1 ? "rounded-tr-lg" : ""
                              }`}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full border-2 border-white"
                                    style={{ backgroundColor: planner.color }}
                                  />
                                  <Input
                                    value={planner.name}
                                    onChange={(e) => updatePlannerName(planner.id, e.target.value)}
                                    className="bg-white text-black border-0 font-medium"
                                  />
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removePlanner(planner.id)}
                                  className="w-full bg-red-500 hover:bg-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((question, qIndex) => (
                          <tr key={qIndex} className="hover:bg-blue-50/50 transition-colors">
                            <td className="border p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                              <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                  <Badge variant="outline" className="shrink-0">
                                    Q{qIndex + 1}
                                  </Badge>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{question.text}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant={question.benefit ? "default" : "secondary"} className="text-xs">
                                        {question.benefit ? "Benefit" : "Cost"}
                                      </Badge>
                                      <span className="text-xs text-blue-600 font-medium">
                                        Weight: {(question.weight * 100).toFixed(0)}%
                                      </span>
                                      <RadixTooltip>
                                        <TooltipTrigger>
                                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs">{question.tooltip}</p>
                                        </TooltipContent>
                                      </RadixTooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            {planners.map((planner) => (
                              <td key={planner.id} className="border p-4">
                                <RadioGroup
                                  value={planner.responses[qIndex]?.toString() || ""}
                                  onValueChange={(value) => updateResponse(planner.id, qIndex, Number.parseInt(value))}
                                  className="flex justify-center gap-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id={`${planner.id}-${qIndex}-yes`} className="border-2" />
                                    <Label
                                      htmlFor={`${planner.id}-${qIndex}-yes`}
                                      className="font-medium text-green-600"
                                    >
                                      Yes
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="0" id={`${planner.id}-${qIndex}-no`} className="border-2" />
                                    <Label htmlFor={`${planner.id}-${qIndex}-no`} className="font-medium text-red-600">
                                      No
                                    </Label>
                                  </div>
                                </RadioGroup>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Button
                onClick={addPlanner}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Add Vendor
              </Button>
              <Button
                onClick={runTOPSIS}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                size="lg"
                disabled={completionPercentage < 100}
              >
                <BarChart3 className="w-5 h-5" />
                Run TOPSIS Analysis
              </Button>
              <Button variant="outline" onClick={resetAll} className="flex items-center gap-2" size="lg">
                <RotateCcw className="w-5 h-5" />
                Reset All
              </Button>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence>
              {showResults && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Results Header */}
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <Trophy className="w-6 h-6" />
                        TOPSIS Analysis Results
                      </CardTitle>
                      <CardDescription>Mathematical ranking based on closeness to ideal solution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CheckCircle2 className="w-8 h-8 text-green-500" />
                          <div>
                            <p className="font-semibold text-lg">Analysis Complete!</p>
                            <p className="text-muted-foreground">
                              {planners.length} vendors evaluated across {questions.length} criteria
                            </p>
                          </div>
                        </div>
                        <Button onClick={exportResults} variant="outline" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export CSV
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Winner Card */}
                  {results[0] && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                              <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-yellow-700">🏆 Top Choice: {results[0].name}</h3>
                              <p className="text-yellow-600">
                                Closeness Score: {results[0].closeness.toFixed(4)} ({results[0].percentage.toFixed(1)}%)
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-yellow-600">#{results[0].rank}</div>
                              <div className="text-sm text-yellow-500">Best Vendor</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Results Visualization */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5" />
                        Results Visualization
                      </CardTitle>
                      <CardDescription>Visual comparison of vendor performance scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="bar" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="bar" className="flex items-center gap-2">
                            <BarChart className="w-4 h-4" />
                            Bar Chart
                          </TabsTrigger>
                          <TabsTrigger value="table" className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Data Table
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="bar" className="space-y-4">
                          <div className="h-[400px] w-full border rounded-lg p-4 bg-white">
                            {chartData && chartData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart
                                  data={chartData}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 60,
                                  }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                                  <YAxis domain={[0, "dataMax"]} tickFormatter={(value) => value.toFixed(2)} />
                                  <Bar dataKey="score" fill="#3B82F6">
                                    {chartData.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.rank === 1 ? "#FFD700" : entry.color}
                                        stroke={entry.rank === 1 ? "#FF8C00" : "none"}
                                        strokeWidth={entry.rank === 1 ? 2 : 0}
                                      />
                                    ))}
                                  </Bar>
                                </RechartsBarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                  <BarChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                  <p className="text-lg font-medium">No Chart Data Available</p>
                                  <p className="text-sm">Run the TOPSIS analysis to see results</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Debug Information */}
                          {process.env.NODE_ENV === "development" && (
                            <div className="text-xs bg-gray-100 p-2 rounded">
                              <p>
                                <strong>Debug Info:</strong>
                              </p>
                              <p>Chart Data Length: {chartData?.length || 0}</p>
                              <p>Results Length: {results?.length || 0}</p>
                              <p>Show Results: {showResults.toString()}</p>
                              {chartData && chartData.length > 0 && (
                                <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(chartData, null, 2)}</pre>
                              )}
                            </div>
                          )}

                          <Alert>
                            <BarChart className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Chart interpretation:</strong> Bars represent each vendor's closeness score (0-1).
                              Higher scores indicate better overall performance across all weighted criteria. The
                              top-ranked vendor is highlighted in gold.
                            </AlertDescription>
                          </Alert>
                        </TabsContent>

                        <TabsContent value="table">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="border p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tl-lg">
                                    Rank
                                  </th>
                                  <th className="border p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    Vendor
                                  </th>
                                  <th className="border p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    Score
                                  </th>
                                  <th className="border p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    Performance
                                  </th>
                                  {questions.map((_, i) => (
                                    <th
                                      key={i}
                                      className="border p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                    >
                                      Q{i + 1}
                                    </th>
                                  ))}
                                  <th className="border p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-lg">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {results.map((result, index) => (
                                  <motion.tr
                                    key={result.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${
                                      result.rank === 1
                                        ? "bg-gradient-to-r from-green-50 to-yellow-50 border-green-200"
                                        : "hover:bg-blue-50/50"
                                    } transition-colors`}
                                  >
                                    <td className="border p-3 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        {result.rank === 1 && <Star className="w-4 h-4 text-yellow-500" />}
                                        <span className={`font-bold ${result.rank === 1 ? "text-yellow-600" : ""}`}>
                                          #{result.rank}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="border p-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-4 h-4 rounded-full"
                                          style={{ backgroundColor: result.color }}
                                        />
                                        <span className="font-medium">{result.name}</span>
                                      </div>
                                    </td>
                                    <td className="border p-3 text-center font-mono">{result.closeness.toFixed(4)}</td>
                                    <td className="border p-3">
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                          <span>{result.percentage.toFixed(1)}%</span>
                                        </div>
                                        <Progress value={result.percentage} className="h-2" />
                                      </div>
                                    </td>
                                    {result.originalValues.map((val, i) => (
                                      <td key={i} className="border p-3 text-center">
                                        <Badge variant={val === 1 ? "default" : "secondary"}>
                                          {val === 1 ? "Yes" : "No"}
                                        </Badge>
                                      </td>
                                    ))}
                                    <td className="border p-3 text-center">
                                      {result.rank === 1 ? (
                                        <Badge className="bg-green-500">🏆 Top Choice</Badge>
                                      ) : result.rank <= 3 ? (
                                        <Badge variant="secondary">Top 3</Badge>
                                      ) : (
                                        <Badge variant="outline">Option</Badge>
                                      )}
                                    </td>
                                  </motion.tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <Separator className="my-6" />

                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <strong>How to interpret:</strong> Higher closeness scores (closer to 1.0) indicate better
                          overall performance. The TOPSIS method considers both positive and negative ideal solutions to
                          provide balanced rankings. The top choice represents the best compromise across all weighted
                          criteria.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
