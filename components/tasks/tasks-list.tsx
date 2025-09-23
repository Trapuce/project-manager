"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Calendar, MessageSquare, Paperclip, Edit, Trash2, ArrowUpDown } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Intégrer l'API de paiement Stripe",
    description: "Configurer et tester les paiements en ligne avec gestion des erreurs",
    project: "Site E-commerce",
    status: "En cours",
    priority: "Haute",
    assignee: { name: "Alice Dupont", avatar: "A" },
    dueDate: "2023-12-20",
    createdDate: "2023-12-10",
    commentsCount: 3,
    attachmentsCount: 2,
    completed: false,
  },
  {
    id: 2,
    title: "Créer les maquettes mobile",
    description: "Design des écrans principaux pour l'application mobile",
    project: "App Mobile",
    status: "À faire",
    priority: "Moyenne",
    assignee: { name: "David Martin", avatar: "D" },
    dueDate: "2023-12-22",
    createdDate: "2023-12-12",
    commentsCount: 1,
    attachmentsCount: 0,
    completed: false,
  },
  {
    id: 3,
    title: "Tests utilisateurs",
    description: "Organiser et analyser les retours des utilisateurs beta",
    project: "Refonte UI/UX",
    status: "Terminé",
    priority: "Basse",
    assignee: { name: "Grace Bernard", avatar: "G" },
    dueDate: "2023-12-15",
    createdDate: "2023-12-05",
    commentsCount: 5,
    attachmentsCount: 1,
    completed: true,
  },
  {
    id: 4,
    title: "Optimisation des performances",
    description: "Améliorer les temps de chargement et optimiser le SEO",
    project: "Site E-commerce",
    status: "En cours",
    priority: "Haute",
    assignee: { name: "Bob Petit", avatar: "B" },
    dueDate: "2023-12-18",
    createdDate: "2023-12-08",
    commentsCount: 2,
    attachmentsCount: 3,
    completed: false,
  },
  {
    id: 5,
    title: "Documentation API",
    description: "Rédiger la documentation complète de l'API REST",
    project: "API Backend",
    status: "À faire",
    priority: "Moyenne",
    assignee: { name: "Henry Durand", avatar: "H" },
    dueDate: "2023-12-25",
    createdDate: "2023-12-13",
    commentsCount: 0,
    attachmentsCount: 0,
    completed: false,
  },
  {
    id: 6,
    title: "Configuration CI/CD",
    description: "Mettre en place les pipelines de déploiement automatique",
    project: "Infrastructure",
    status: "En retard",
    priority: "Haute",
    assignee: { name: "Iris Moreau", avatar: "I" },
    dueDate: "2023-12-16",
    createdDate: "2023-12-01",
    commentsCount: 4,
    attachmentsCount: 1,
    completed: false,
  },
]

const statusColors = {
  "À faire": "secondary",
  "En cours": "default",
  Terminé: "secondary",
  "En retard": "destructive",
} as const

const priorityColors = {
  Haute: "destructive",
  Moyenne: "default",
  Basse: "secondary",
} as const

export function TasksList() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("dueDate")

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Liste des tâches</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Échéance</SelectItem>
                <SelectItem value="priority">Priorité</SelectItem>
                <SelectItem value="status">Statut</SelectItem>
                <SelectItem value="created">Date de création</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {selectedTasks.length > 0 && (
          <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
            <span className="text-sm">{selectedTasks.length} tâche(s) sélectionnée(s)</span>
            <Button variant="outline" size="sm">
              Marquer comme terminé
            </Button>
            <Button variant="outline" size="sm">
              Assigner
            </Button>
            <Button variant="outline" size="sm" className="text-destructive bg-transparent">
              Supprimer
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              checked={selectedTasks.includes(task.id)}
              onCheckedChange={() => toggleTaskSelection(task.id)}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Link href={`/dashboard/tasks/${task.id}`}>
                    <h4
                      className={`font-medium hover:text-primary cursor-pointer ${task.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {task.title}
                    </h4>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{task.project}</span>
                    <span>•</span>
                    <span>Créé le {task.createdDate}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>{task.priority}</Badge>
                  <Badge variant={statusColors[task.status as keyof typeof statusColors]}>{task.status}</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    {task.commentsCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{task.commentsCount}</span>
                      </div>
                    )}
                    {task.attachmentsCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="h-3 w-3" />
                        <span>{task.attachmentsCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
