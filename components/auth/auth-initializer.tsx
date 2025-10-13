"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function AuthInitializer() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialiser l'authentification au montage du composant
    initializeAuth()
  }, [initializeAuth])

  // Ce composant ne rend rien, il sert juste à initialiser l'auth
  return null
}
