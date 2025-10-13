"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuthStore } from "@/stores/auth-store"
import { usersService } from "@/lib/api"
import { updateProfileSchema, type UpdateProfileFormData } from "@/lib/validations/user-schemas"
import { actionToast } from "@/components/ui/action-toast"
import { Save, Loader2 } from "lucide-react"

export function ProfileForm() {
  const { user, refreshUser } = useAuthStore()
  const router = useRouter()

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      department: "",
    },
  })

  // Pré-remplir le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        department: user.department || "",
      })
    }
  }, [user, form])

  const onSubmit = async (data: UpdateProfileFormData) => {
    if (!user) return

    try {
      await usersService.updateProfile(data)
      await refreshUser()
      actionToast.updateSuccess("Profil")
      // Délai pour permettre aux données de se charger avant redirection
      setTimeout(() => {
        router.replace('/dashboard')
      }, 1000)
    } catch (error: any) {
      actionToast.updateError("Profil", { description: "Erreur lors de la mise à jour du profil" })
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </form>
    </Form>
  )
}