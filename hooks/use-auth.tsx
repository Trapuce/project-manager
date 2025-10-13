"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Rafraîchir l'utilisateur au montage du composant
  useEffect(() => {
    if (authStore.isAuthenticated && !authStore.user) {
      authStore.refreshUser()
    }
  }, [authStore.isAuthenticated, authStore.user, authStore.refreshUser])

  return {
    user: authStore.user,
    isLoading: authStore.isLoading,
    isAuthenticated: authStore.isAuthenticated,
    error: authStore.error,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    refreshUser: authStore.refreshUser,
    clearError: authStore.clearError,
  }
}