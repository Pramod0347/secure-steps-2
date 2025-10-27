// 1. UPDATED AUTH CONTEXT (AuthContext.tsx)
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { UserRole } from "@prisma/client"

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  countryCode?: string | null
  phoneNumber?: string | null
  name?: string | null
  bio?: string | null
  avatarUrl?: string | null
  banner?: string | null
  isVerified: boolean
  isPhoneVerified?: boolean | null
  isEmailVerified: boolean
  followersCount?: number | null
  followingCount?: number | null
}

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isAuthenticated: boolean
  isInitialized: boolean
  loading: boolean
  error: string | null
  login: (userData: User) => Promise<void>
  logout: () => Promise<void>
  updateUserData: (updates: Partial<User>) => Promise<void>
  getUserData: () => User | null
  clearError: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const isValidUserData = useCallback((data: unknown): data is User => {
    if (!data || typeof data !== "object") return false
    const userData = data as Partial<User>

    return Boolean(
      userData.id &&
      userData.username &&
      userData.email &&
      userData.role &&
      Object.values(UserRole).includes(userData.role),
    )
  }, [])

  const clearAuthState = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      sessionStorage.clear()
    }
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
  }, [])

  // Verify token and refresh if needed
  const verifyAndRefreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
          setIsAuthenticated(true)
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(data.user))
          }
          return true
        }
      }

      // If verify fails, try to refresh
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        if (refreshData.success && refreshData.user) {
          setUser(refreshData.user)
          setIsAuthenticated(true)
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(refreshData.user))
          }
          return true
        }
      }

      // Both failed, clear auth state
      clearAuthState()
      return false
    } catch (error) {
      console.error('Token verification/refresh failed:', error)
      clearAuthState()
      return false
    }
  }, [clearAuthState])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)

        // First check if we have stored user data
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser)
              if (isValidUserData(parsedUser)) {
                // Verify the token is still valid
                const isValid = await verifyAndRefreshToken()
                if (!isValid) {
                  clearAuthState()
                }
              } else {
                clearAuthState()
              }
            } catch {
              clearAuthState()
            }
          } else {
            // No stored user, but check if we have valid cookies
            await verifyAndRefreshToken()
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        clearAuthState()
      } finally {
        setLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [clearAuthState, isValidUserData, verifyAndRefreshToken])

  const login = useCallback(
    async (userData: User) => {
      try {
        setLoading(true)
        setError(null)

        if (!isValidUserData(userData)) {
          throw new Error("Invalid user data")
        }

        setUser(userData)
        setIsAuthenticated(true)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData))
        }

        toast.success("Successfully logged in")
        router.push("/")
      } catch (error) {
        console.error("Login error:", error)
        clearAuthState()
        throw error
      } finally {
        setLoading(false)
      }
    },
    [router, clearAuthState, isValidUserData],
  )

  const logout = useCallback(async () => {
    try {
      setLoading(true)

      // Always clear local state first
      clearAuthState()

      // Then try to logout from server
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        })
      } catch (serverError) {
        console.error('Server logout failed:', serverError)
        // Don't throw error here - local logout already happened
      }

      toast.success('Logged out successfully')
      router.push('/auth/signin')
    } catch (err) {
      console.error('Logout error:', err)
      toast.error('Logout completed with some issues')
      // Still redirect even if there were errors
      router.push('/auth/signin')
    } finally {
      setLoading(false)
    }
  }, [router, clearAuthState])

  const refreshAuth = useCallback(async () => {
    await verifyAndRefreshToken()
  }, [verifyAndRefreshToken])

  const updateUserData = useCallback(
    async (updates: Partial<User>) => {
      try {
        setLoading(true)
        setError(null)

        if (!user) {
          throw new Error("No user logged in")
        }

        const updatedUser = { ...user, ...updates }
        if (!isValidUserData(updatedUser)) {
          throw new Error("Invalid update data")
        }

        setUser(updatedUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
        toast.success("User data updated successfully")
      } catch (error) {
        console.error("Update user data error:", error)
        setError("Failed to update user data")
        throw error
      } finally {
        setLoading(false)
      }
    },
    [user, isValidUserData],
  )

  const getUserData = useCallback((): User | null => {
    return user
  }, [user])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleSetError = useCallback((error: string | null) => {
    setError(error)
    if (error) {
      toast.error(error)
    }
  }, [])

  if (!isInitialized) {
    return null
  }

  const contextValue: AuthContextType = {
    user,
    setUser,
    isAuthenticated,
    isInitialized,
    loading,
    error,
    login,
    logout,
    updateUserData,
    getUserData,
    clearError,
    setLoading,
    setError: handleSetError,
    refreshAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}
