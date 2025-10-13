"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { actionToast } from "@/components/ui/action-toast"
import { usersService } from "@/lib/api"
import { useAuthStore } from "@/stores/auth-store"
import { updateProfileSchema, changePasswordSchema, type UpdateProfileFormData, type ChangePasswordFormData } from "@/lib/validations"
import { Settings, User, Lock, Mail, Phone, Building, Calendar, Save } from "lucide-react"
import { ProfileImageUpload } from "@/components/ui/profile-image-upload"
import { SectionTransition, FadeInTransition } from "@/components/ui/section-transition"

export default function SettingsPage() {
  const { user, refreshUser } = useAuthStore()
  const [isUpdatingImage, setIsUpdatingImage] = useState(false)
  const router = useRouter()

  // Formulaire de profil
  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      department: "",
    },
  })

  // Formulaire de changement de mot de passe
  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })

  // Pré-remplir le formulaire de profil
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        department: user.department || "",
      })
    }
  }, [user, profileForm])

  const handleImageUpdate = async (imageUrl: string) => {
    if (!user) return

    setIsUpdatingImage(true)
    try {
      await usersService.updateProfile({ 
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        department: user.department,
      })
      await refreshUser()
      actionToast.updateSuccess("Photo de profil")
    } catch (error: any) {
      actionToast.updateError("Photo de profil", { description: "Erreur lors de la mise à jour de la photo" })
    } finally {
      setIsUpdatingImage(false)
    }
  }

  const handleSaveProfile = async (data: UpdateProfileFormData) => {
    try {
      await usersService.updateProfile(data)
      await refreshUser()
      actionToast.updateSuccess("Profil")
      // Délai pour permettre aux données de se charger avant redirection
      setTimeout(() => {
        router.replace('/dashboard/profile')
      }, 1000)
    } catch (error: any) {
      actionToast.updateError("Profil", { description: "Erreur lors de la mise à jour du profil" })
    }
  }

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      await usersService.changePassword(data.currentPassword, data.newPassword)
      passwordForm.reset()
      actionToast.updateSuccess("Mot de passe")
    } catch (error: any) {
      actionToast.updateError("Mot de passe", { description: "Erreur lors du changement de mot de passe" })
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FadeInTransition>
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-balance">Paramètres</h1>
            <p className="text-muted-foreground">Gérez votre profil et vos paramètres de compte</p>
          </div>
        </div>
      </FadeInTransition>

      <SectionTransition delay={0.1}>
        <div className="grid gap-6">
          {/* Profil Utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil Utilisateur
              </CardTitle>
              <CardDescription>Informations personnelles et de contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar et informations de base */}
              <div className="flex items-center gap-6">
                <ProfileImageUpload
                  currentImage={user.profilePicture}
                  userName={`${user.firstName} ${user.lastName}`}
                  onImageUpdate={handleImageUpdate}
                  disabled={isUpdatingImage}
                />
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">{user.firstName} {user.lastName}</h3>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === 'ADMIN' ? 'destructive' : user.role === 'MANAGER' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formulaire de profil */}
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 1 23 45 67 89" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Département</FormLabel>
                          <FormControl>
                            <Input placeholder="IT, Marketing, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                      {profileForm.formState.isSubmitting && <Save className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>Gérez votre mot de passe et la sécurité de votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe actuel</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                      {passwordForm.formState.isSubmitting && <Save className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Changer le mot de passe
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Informations du compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informations du compte
              </CardTitle>
              <CardDescription>Détails de votre compte et historique</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de création</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Dernière mise à jour</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionTransition>
    </div>
  )
}