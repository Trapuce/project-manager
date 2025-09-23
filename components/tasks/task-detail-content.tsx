"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileUpload } from "@/components/ui/file-upload"
import { Edit, Save, X, Paperclip, Download, Eye, Trash2 } from "lucide-react"

interface TaskDetailContentProps {
  taskId: string
}

const attachments = [
  {
    id: 1,
    name: "stripe-integration-spec.pdf",
    size: "2.4 MB",
    type: "application/pdf",
    url: "/uploads/stripe-spec.pdf",
  },
  { id: 2, name: "payment-flow-diagram.png", size: "856 KB", type: "image/png", url: "/uploads/payment-flow.png" },
  {
    id: 3,
    name: "api-documentation.docx",
    size: "1.2 MB",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    url: "/uploads/api-docs.docx",
  },
]

const subtasks = [
  { id: 1, title: "Configurer les clés API Stripe", completed: true },
  { id: 2, title: "Implémenter le formulaire de paiement", completed: true },
  { id: 3, title: "Gérer les webhooks", completed: false },
  { id: 4, title: "Tests d'intégration", completed: false },
]

export function TaskDetailContent({ taskId }: TaskDetailContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [description, setDescription] = useState(
    "Cette tâche consiste à intégrer complètement l'API de paiement Stripe dans notre plateforme e-commerce. Il faut configurer les webhooks pour gérer les événements de paiement et implémenter une gestion d'erreur robuste.",
  )

  const completedSubtasks = subtasks.filter((task) => task.completed).length
  const progressPercentage = (completedSubtasks / subtasks.length) * 100

  const handleFileUpload = (files: File[]) => {
    console.log("Files uploaded:", files)
    setShowUpload(false)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("document") || type.includes("word")) return "📝"
    return "📎"
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Description</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => setIsEditing(false)}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">{description}</p>
          )}
        </CardContent>
      </Card>

      {/* Sous-tâches */}
      <Card>
        <CardHeader>
          <CardTitle>Sous-tâches</CardTitle>
          <CardDescription>
            {completedSubtasks}/{subtasks.length} terminées
          </CardDescription>
          <Progress value={progressPercentage} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center space-x-3">
              <input type="checkbox" checked={subtask.completed} className="rounded border-gray-300" readOnly />
              <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>{subtask.title}</span>
              {subtask.completed && <Badge variant="secondary">Terminé</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pièces jointes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pièces jointes</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowUpload(!showUpload)}>
              <Paperclip className="mr-2 h-4 w-4" />
              {showUpload ? "Annuler" : "Ajouter"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showUpload && (
            <FileUpload
              onUpload={handleFileUpload}
              maxFiles={5}
              maxSize={10}
              acceptedTypes={["image/*", "application/pdf", ".doc", ".docx", ".txt", ".zip"]}
            />
          )}

          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-lg">
                    {getFileIcon(attachment.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" title="Prévisualiser">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Télécharger">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Supprimer"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
