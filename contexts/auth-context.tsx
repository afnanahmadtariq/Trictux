"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type User = {
  id?: string
  email: string
  name: string
  userType: "owner" | "company" | "employee"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<boolean>
  setUser: (user: User | null) => void // Add setUser to context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is authenticated on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      setLoading(false)
      
      // If we're on a page that requires auth and user is not authenticated, redirect to login
      if (!isAuthenticated && !window.location.pathname.includes('/auth/')) {
        router.push('/auth/login')
      }
    }
    
    checkAuthStatus()
  }, [])

  // Check if user is authenticated
  const checkAuth = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          return true
        }
      }
      setUser(null)
      return false
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
      return false
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (res.ok && data.user) {
        setUser(data.user)
        
        // Navigate based on user type
        if (data.user.userType === 'owner') {
          router.push('/company-dashboard')
        } else if (data.user.userType === 'company') {
          router.push('/company-dashboard')
        } else if (data.user.userType === 'employee') {
          router.push('/employee-dashboard')
        }
        
        return true
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      setUser(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
