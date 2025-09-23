"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface TaskCommentsProps {
  taskId: string
}

const comments = [
  {
    id: 1,
    author: { name: "Alice Dupont", avatar: "A" },
    content: "J'ai commencé l'intégration. Les clés API sont configurées et les tests de base passent.",
    timestamp: "Il y a 2h",
  },
  {
    id: 2,
    author: { name: "Bob Martin", avatar: "B" },
    content: "Super ! N'oublie pas de tester les cas d'erreur, notamment les cartes refusées.",
    timestamp: "Il y a 1h",
  },
  {
    id: 3,
    author: { name: "Alice Dupont", avatar: "A" },
    content: "Bien vu, je vais ajouter ces tests. J'ai aussi besoin de clarifier la gestion des webhooks.",
    timestamp: "Il y a 30min",
  },
]

export function TaskComments({ taskId }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commentaires</CardTitle>
        <CardDescription>{comments.length} commentaire(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{comment.author.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button type="submit" size="sm" disabled={!newComment.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Commenter
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
