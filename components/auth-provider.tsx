"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  image?: string
} | null

type AuthContextType = {
  user: User
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoading: boolean
}

const defaultUser = {
  id: "default-user",
  name: "Default User",
  email: "user@example.com",
  image: "/placeholder.svg?height=40&width=40",
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // For now, we'll always use the default user
    setUser(defaultUser)
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      setUser(defaultUser)
      localStorage.setItem("user", JSON.stringify(defaultUser))
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      setUser(defaultUser)
      localStorage.setItem("user", JSON.stringify(defaultUser))
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setUser(defaultUser) // Instead of null, we'll keep the default user
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

