"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export type User = {
  id: string
  email: string
  balance: number
  role: "user" | "admin"
  inventory: Card[]
}

export type Card = {
  id: string
  name: string
  rarity: "common" | "silver" | "gold" | "diamond" | "legendary"
  imageUrl: string
  price: number
  collectionId?: string
}

export type Collection = {
  id: string
  name: string
  description?: string
}

export type Case = {
  id: string
  name: string
  price: number
  imageUrl: string
  cards: string[] // Card IDs
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateBalance: (amount: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Simulate fetching user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // In a real app, this would be an API call to check session
        const storedUser = localStorage.getItem("tcg-user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to restore session", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock login - replace with actual API call
      const mockUser: User = {
        id: "user-1",
        email,
        balance: 1000,
        role: email.includes("admin") ? "admin" : "user",
        inventory: [],
      }

      setUser(mockUser)
      localStorage.setItem("tcg-user", JSON.stringify(mockUser))
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${email}!`,
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    try {
      // Mock Google login - replace with actual OAuth flow
      const mockUser: User = {
        id: "user-google-1",
        email: "user@example.com",
        balance: 1000,
        role: "user",
        inventory: [],
      }

      setUser(mockUser)
      localStorage.setItem("tcg-user", JSON.stringify(mockUser))
      toast({
        title: "Logged in with Google",
        description: "Welcome to TCG Case Opening!",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    // Mock logout - replace with actual API call
    setUser(null)
    localStorage.removeItem("tcg-user")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    router.push("/login")
  }

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: user.balance + amount,
      }
      setUser(updatedUser)
      localStorage.setItem("tcg-user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        updateBalance,
      }}
    >
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
