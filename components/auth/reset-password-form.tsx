"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth-schemas"
import { actionToast } from "@/components/ui/action-toast"
import { Loader2, ArrowLeft } from "lucide-react"

export function ResetPasswordForm() {
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsEmailSent(true)
      actionToast.success("Email envoyé", { description: "Vérifiez votre boîte mail pour le lien de réinitialisation." })
    } catch (error) {
      actionToast.error("Impossible d'envoyer l'email. Réessayez plus tard.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Email envoyé !</h3>
          <p className="text-sm text-muted-foreground">
            Vérifiez votre boîte mail pour le lien de réinitialisation.
          </p>
        </div>
        <Link href="/auth/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Réinitialiser le mot de passe</h3>
          <p className="text-sm text-muted-foreground">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Envoyer le lien
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </form>
    </Form>
  )
}