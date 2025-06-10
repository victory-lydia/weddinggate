"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "admin" | "planner" | "couple"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("wedding-gate-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real Firebase Auth
    if (email && password) {
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" : email.includes("planner") ? "planner" : "couple",
      }
      setUser(mockUser)
      localStorage.setItem("wedding-gate-user", JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    // Mock registration - replace with real Firebase Auth
    if (email && password && name) {
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
      }
      setUser(mockUser)
      localStorage.setItem("wedding-gate-user", JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("wedding-gate-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
