"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthState } from "@/types/auth"
import { v4 as uuidv4 } from "uuid"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuthRequired: (feature: string) => { required: boolean; message: string }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("tosca_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would validate credentials with your backend
    // For demo purposes, we'll accept any email/password with basic validation
    if (!email || !password) {
      return false
    }

    const user: User = {
      id: uuidv4(),
      email,
      name: email.split("@")[0],
      isPremium: false,
      createdAt: new Date().toISOString(),
    }

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })

    localStorage.setItem("tosca_user", JSON.stringify(user))
    return true
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would register the user with your backend
    // For demo purposes, we'll accept any valid input
    if (!name || !email || !password) {
      return false
    }

    const user: User = {
      id: uuidv4(),
      email,
      name,
      isPremium: false,
      createdAt: new Date().toISOString(),
    }

    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })

    localStorage.setItem("tosca_user", JSON.stringify(user))
    return true
  }

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })

    localStorage.removeItem("tosca_user")
  }

  const checkAuthRequired = (feature: string): { required: boolean; message: string } => {
    // Define premium features that require authentication
    const premiumFeatures = ["image-generation", "file-upload", "audio-recording"]

    if (premiumFeatures.includes(feature) && !authState.isAuthenticated) {
      return {
        required: true,
        message: "Cette fonctionnalité nécessite un compte. Veuillez vous connecter ou vous inscrire.",
      }
    }

    return {
      required: false,
      message: "",
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        checkAuthRequired,
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

