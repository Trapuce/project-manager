"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"

export function ResetPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsEmailSent(true)
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour le lien de réinitialisation.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Réessayez plus tard.",
        variant: "destructive",
      })
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
            Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
          </p>
        </div>
        <Link href="/auth/login">
          <Button variant="outline" className="w-full bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Envoyer le lien de réinitialisation
      </Button>

      <div className="text-center">
        <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-1 h-3 w-3 inline" />
          Retour à la connexion
        </Link>
      </div>
    </form>
  )
}
