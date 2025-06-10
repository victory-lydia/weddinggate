"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/navigation/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mic, MicOff, Send, Volume2, VolumeX, Bot, User, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  links?: { text: string; url: string }[]
}

interface WeddingGateKnowledge {
  [key: string]: {
    description: string
    url: string
    keywords: string[]
  }
}

const weddingGateKnowledge: WeddingGateKnowledge = {
  "couple-registration": {
    description:
      "Register new couples with their wedding details, contact information, and preferences according to Cameroon standards",
    url: "/operations/couple-registration",
    keywords: ["couple", "register", "registration", "wedding", "bride", "groom", "partners", "marriage"],
  },
  "vendor-registration": {
    description: "Register wedding vendors including photographers, caterers, decorators, and other service providers",
    url: "/operations/vendor-registration",
    keywords: ["vendor", "supplier", "photographer", "caterer", "decorator", "musician", "florist", "service provider"],
  },
  "vendor-selection": {
    description: "Find and select the best vendors for your wedding based on location, budget, and preferences",
    url: "/operations/vendor-selection",
    keywords: ["find vendor", "select vendor", "search vendor", "choose vendor", "vendor directory"],
  },
  payment: {
    description:
      "Process payments using Cameroon payment methods including Orange Money, MTN Mobile Money, and bank transfers",
    url: "/operations/payment",
    keywords: ["payment", "pay", "money", "orange money", "mtn", "mobile money", "bank transfer", "fcfa"],
  },
  diagnostic: {
    description:
      "Take the WeddingGate Fit Assessment to see if our platform is right for your wedding planning business",
    url: "/diagnostic",
    keywords: ["diagnostic", "assessment", "test", "evaluation", "fit", "quiz", "analysis"],
  },
  topsis: {
    description: "Use the TOPSIS evaluation tool for advanced ranking and decision-making for wedding planners",
    url: "/topsis",
    keywords: ["topsis", "ranking", "evaluation", "decision", "analysis", "comparison", "scoring"],
  },
  operations: {
    description:
      "Access all wedding operations including couple registration, vendor management, and payment processing",
    url: "/operations",
    keywords: ["operations", "manage", "dashboard", "overview", "main menu"],
  },
  analytics: {
    description: "View analytics and insights about your wedding planning business performance",
    url: "/analytics",
    keywords: ["analytics", "insights", "reports", "statistics", "performance", "data"],
  },
  home: {
    description: "Return to the WeddingGate homepage to learn about our platform and features",
    url: "/",
    keywords: ["home", "homepage", "main page", "start", "beginning", "welcome"],
  },
}

export default function WedChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm WedChat, your AI assistant for WeddingGate. I can help you navigate our platform, answer questions about our features, and direct you to the right pages. You can type your questions or use the voice feature to speak with me. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        toast({
          title: "Voice recognition error",
          description: "Please try again or type your message.",
          variant: "destructive",
        })
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
    }

    scrollToBottom()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      // Cancel any ongoing speech
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const findRelevantPages = (query: string): { text: string; url: string }[] => {
    const lowercaseQuery = query.toLowerCase()
    const relevantPages: { text: string; url: string }[] = []

    Object.entries(weddingGateKnowledge).forEach(([key, info]) => {
      const isRelevant = info.keywords.some((keyword) => lowercaseQuery.includes(keyword.toLowerCase()))

      if (isRelevant) {
        relevantPages.push({
          text: `Go to ${key.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
          url: info.url,
        })
      }
    })

    return relevantPages
  }

  const generateResponse = (query: string): { content: string; links: { text: string; url: string }[] } => {
    const lowercaseQuery = query.toLowerCase()
    const links = findRelevantPages(query)

    // Specific responses based on query content
    if (lowercaseQuery.includes("couple") && lowercaseQuery.includes("register")) {
      return {
        content:
          "I can help you with couple registration! Our couple registration system allows you to register new couples with their wedding details, contact information, and preferences according to Cameroon standards. You can add partner information, wedding dates, budget, guest count, and more.",
        links: [{ text: "Go to Couple Registration", url: "/operations/couple-registration" }],
      }
    }

    if (lowercaseQuery.includes("vendor") && (lowercaseQuery.includes("register") || lowercaseQuery.includes("add"))) {
      return {
        content:
          "Great! I can guide you to vendor registration. Our vendor registration system helps you onboard photographers, caterers, decorators, musicians, and other wedding service providers. You can add their business information, services, pricing, and contact details.",
        links: [{ text: "Go to Vendor Registration", url: "/operations/vendor-registration" }],
      }
    }

    if (
      lowercaseQuery.includes("vendor") &&
      (lowercaseQuery.includes("find") || lowercaseQuery.includes("search") || lowercaseQuery.includes("select"))
    ) {
      return {
        content:
          "Perfect! The vendor selection page helps you find and choose the best vendors for weddings. You can search by category, location, budget, rating, and language preferences. It includes vendor profiles with ratings, specialties, and contact information.",
        links: [{ text: "Go to Vendor Selection", url: "/operations/vendor-selection" }],
      }
    }

    if (lowercaseQuery.includes("payment") || lowercaseQuery.includes("pay") || lowercaseQuery.includes("money")) {
      return {
        content:
          "I can help with payments! Our payment system supports Cameroon payment methods including Orange Money, MTN Mobile Money, bank transfers, and cash payments. You can process payments for wedding services with automatic fee calculation and receipt generation.",
        links: [{ text: "Go to Payment Processing", url: "/operations/payment" }],
      }
    }

    if (
      lowercaseQuery.includes("diagnostic") ||
      lowercaseQuery.includes("assessment") ||
      lowercaseQuery.includes("test")
    ) {
      return {
        content:
          "The WeddingGate Fit Assessment is a great tool! It's a diagnostic quiz that helps determine if our platform is right for your wedding planning business. You'll answer questions about your current workflow and get personalized recommendations.",
        links: [{ text: "Take the Assessment", url: "/diagnostic" }],
      }
    }

    if (
      lowercaseQuery.includes("topsis") ||
      lowercaseQuery.includes("ranking") ||
      lowercaseQuery.includes("evaluation")
    ) {
      return {
        content:
          "TOPSIS is our advanced evaluation tool! It's designed for wedding planners to make data-driven decisions using weighted criteria and ranking systems. Perfect for comparing vendors, venues, or other wedding options.",
        links: [{ text: "Go to TOPSIS Tool", url: "/topsis" }],
      }
    }

    if (
      lowercaseQuery.includes("analytics") ||
      lowercaseQuery.includes("reports") ||
      lowercaseQuery.includes("insights")
    ) {
      return {
        content:
          "Our analytics dashboard provides valuable insights into your wedding planning business performance. You can view statistics, reports, and data to help you make informed decisions and track your success.",
        links: [{ text: "View Analytics", url: "/analytics" }],
      }
    }

    if (
      lowercaseQuery.includes("operations") ||
      lowercaseQuery.includes("main") ||
      lowercaseQuery.includes("overview")
    ) {
      return {
        content:
          "The operations page is your central hub! It provides access to all main wedding management functions including couple registration, vendor registration, vendor selection, and payment processing. It's your one-stop dashboard for wedding operations.",
        links: [{ text: "Go to Operations", url: "/operations" }],
      }
    }

    if (lowercaseQuery.includes("home") || lowercaseQuery.includes("start") || lowercaseQuery.includes("beginning")) {
      return {
        content:
          "The homepage is where it all begins! It showcases WeddingGate's features, benefits, and how our platform can help wedding planners grow their businesses. You'll find information about our services and can get started from there.",
        links: [{ text: "Go to Homepage", url: "/" }],
      }
    }

    // General response with multiple relevant links
    if (links.length > 0) {
      return {
        content: `I found several relevant sections for your query. WeddingGate offers comprehensive wedding planning tools including couple management, vendor services, payment processing, and business analytics. Here are the most relevant pages for your question:`,
        links: links.slice(0, 3), // Limit to 3 most relevant links
      }
    }

    // Default response
    return {
      content:
        "I'm here to help you navigate WeddingGate! Our platform offers couple registration, vendor management, payment processing, diagnostic tools, TOPSIS evaluation, and analytics. You can ask me about any of these features, and I'll guide you to the right page. What specific aspect of wedding planning would you like to explore?",
      links: [
        { text: "View All Operations", url: "/operations" },
        { text: "Take Assessment", url: "/diagnostic" },
      ],
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        links: response.links,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Speak the response if voice is enabled
      if (voiceEnabled) {
        speak(response.content)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">WedChat AI Assistant</h1>
          <p className="text-gray-600">Your intelligent guide to WeddingGate platform</p>

          {/* Voice Controls */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <Badge variant={voiceEnabled ? "default" : "secondary"} className="flex items-center space-x-1">
              {voiceEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
              <span>Voice {voiceEnabled ? "On" : "Off"}</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setVoiceEnabled(!voiceEnabled)}>
              {voiceEnabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            {isSpeaking && (
              <Button variant="outline" size="sm" onClick={stopSpeaking}>
                Stop Speaking
              </Button>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="bg-white shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-indigo-600" />
              <span>Chat with WedChat</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user" ? "bg-blue-500" : "bg-indigo-500"}`}
                    >
                      {message.type === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.links && message.links.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.links.map((link, index) => (
                            <Link key={index} href={link.url}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-between text-xs bg-white hover:bg-gray-50"
                              >
                                {link.text}
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about WeddingGate..."
                    disabled={isLoading}
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute right-1 top-1 h-8 w-8 p-0 ${isListening ? "text-red-500" : "text-gray-400"}`}
                    onClick={isListening ? stopListening : startListening}
                    disabled={!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {isListening && (
                <div className="mt-2 text-center">
                  <Badge variant="destructive" className="animate-pulse">
                    <Mic className="h-3 w-3 mr-1" />
                    Listening...
                  </Badge>
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500 text-center">
                Type your question or click the microphone to speak
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "How do I register a couple?",
              "How to add a new vendor?",
              "How to process payments?",
              "What is the diagnostic tool?",
              "How to use TOPSIS?",
              "Where can I see analytics?",
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 justify-start"
                onClick={() => setInputMessage(question)}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm">{question}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
