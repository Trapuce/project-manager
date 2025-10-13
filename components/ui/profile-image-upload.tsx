"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { filesService } from "@/lib/api"
import { actionToast } from "@/components/ui/action-toast"

interface ProfileImageUploadProps {
  currentImage?: string
  userName: string
  onImageUpdate: (imageUrl: string) => void
  disabled?: boolean
}

export function ProfileImageUpload({ 
  currentImage, 
  userName, 
  onImageUpdate, 
  disabled = false 
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!filesService.isImageFile(file)) {
      actionToast.error("Type de fichier non supporté", {
        description: "Veuillez sélectionner une image (JPG, PNG, GIF)"
      })
      return
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      actionToast.error("Fichier trop volumineux", {
        description: "La taille maximale autorisée est de 5MB"
      })
      return
    }

    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Uploader le fichier
    uploadImage(file)
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    try {
      const uploadedFile = await filesService.uploadProfileImage(file)
      
      // Construire l'URL de l'image à partir du filePath
      const imageUrl = uploadedFile.filePath.startsWith('http') 
        ? uploadedFile.filePath 
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${uploadedFile.filePath}`
      
      // Mettre à jour l'image de profil
      onImageUpdate(imageUrl)
      
      actionToast.success("Photo de profil mise à jour", {
        description: "Votre nouvelle photo de profil a été sauvegardée"
      })
    } catch (error) {
      console.error('Error uploading profile image:', error)
      actionToast.error("Erreur lors de l'upload", {
        description: error instanceof Error ? error.message : "Impossible de télécharger l'image"
      })
      setPreviewImage(null)
    } finally {
      setIsUploading(false)
      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage(null)
    onImageUpdate("")
    actionToast.info("Photo de profil supprimée", {
      description: "Votre photo de profil a été retirée"
    })
  }

  const getUserInitials = () => {
    const names = userName.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return userName.substring(0, 2).toUpperCase()
  }

  const displayImage = previewImage || currentImage

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={displayImage} alt={userName} />
          <AvatarFallback className="text-2xl">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
        
        {displayImage && !isUploading && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Upload en cours...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {displayImage ? "Changer la photo" : "Ajouter une photo"}
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          JPG, PNG ou GIF • Max 5MB
        </p>
      </div>
    </div>
  )
}
