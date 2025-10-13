"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ProfileImageUpload } from "@/components/ui/profile-image-upload"
import { useAuthStore } from "@/stores/auth-store"
import { usersService } from "@/lib/api"
import { actionToast } from "@/components/ui/action-toast"
import { Loader2 } from "lucide-react"

export function ProfileHeader() {
  const { user, refreshUser } = useAuthStore()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleImageUpdate = async (imageUrl: string) => {
    if (!user) return
    
    setIsUpdating(true)
    try {
      await usersService.updateProfile({ profilePicture: imageUrl })
      await refreshUser() // Rafraîchir les données utilisateur
    } catch (error) {
      actionToast.error("Erreur lors de la mise à jour", {
        description: "Impossible de mettre à jour la photo de profil"
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur'
      case 'MANAGER': return 'Manager'
      case 'MEMBER': return 'Membre'
      default: return role
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Actif'
      case 'INACTIVE': return 'Inactif'
      case 'PENDING': return 'En attente'
      default: return status
    }
  }

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `Actif depuis ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `Actif depuis ${months} mois`
    } else {
      const years = Math.floor(diffDays / 365)
      return `Actif depuis ${years} an${years > 1 ? 's' : ''}`
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-6">
      <ProfileImageUpload
        currentImage={user.profilePicture}
        userName={`${user.firstName} ${user.lastName}`}
        onImageUpdate={handleImageUpdate}
        disabled={isUpdating}
      />
      
      <div className="space-y-2">
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'default'}>
            {getRoleLabel(user.role)}
          </Badge>
          <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
            {getStatusLabel(user.status)}
          </Badge>
          {user.createdAt && (
            <Badge variant="outline">
              {formatJoinDate(user.createdAt)}
            </Badge>
          )}
        </div>
        {user.department && (
          <p className="text-sm text-muted-foreground">
            Département: {user.department}
          </p>
        )}
      </div>
    </div>
  )
}
