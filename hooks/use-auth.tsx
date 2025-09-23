"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService, usersService } from '@/lib/api'
import type { User, AuthResponse } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'MANAGER' | 'MEMBER'
  }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user && authService.isAuthenticated()

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await usersService.getCurrentUserProfile()
          setUser(userData)
        } catch (error) {
          console.error('Error loading user:', error)
          // Si l'utilisateur ne peut pas être chargé, déconnecter
          await authService.logout()
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const authResponse: AuthResponse = await authService.login({ email, password })
      setUser(authResponse.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'MANAGER' | 'MEMBER'
  }) => {
    try {
      const authResponse: AuthResponse = await authService.register(userData)
      setUser(authResponse.user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setUser(null)
      router.push('/auth/login')
    }
  }

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await usersService.getCurrentUserProfile()
        setUser(userData)
      } catch (error) {
        console.error('Error refreshing user:', error)
        await logout()
      }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook pour protéger les routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
