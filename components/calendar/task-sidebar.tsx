"use client"

import { format, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Plus } from "lucide-react"

interface TaskSidebarProps {
  selectedDate: Date
}

// Mock data pour les tâches
const mockTasks = [
  {
    id: "1",
    title: "Révision du design système",
    description: "Revoir les composants UI et la cohérence visuelle",
    project: "Site Web Corporate",
    priority: "high" as const,
    status: "in-progress" as const,
    dueDate: new Date(2024, 11, 15),
    assignee: {
      name: "Marie Dubois",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MD",
    },
  },
  {
    id: "2",
    title: "Réunion équipe développement",
    description: "Point hebdomadaire sur l'avancement du projet",
    project: "App Mobile",
    priority: "medium" as const,
    status: "todo" as const,
    dueDate: new Date(2024, 11, 15),
    assignee: {
      name: "Pierre Martin",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "PM",
    },
  },
  {
    id: "3",
    title: "Tests utilisateurs interface",
    description: "Organiser et conduire les tests d'utilisabilité",
    project: "Dashboard Analytics",
    priority: "low" as const,
    status: "todo" as const,
    dueDate: new Date(2024, 11, 15),
    assignee: {
      name: "Sophie Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SC",
    },
  },
]

export function TaskSidebar({ selectedDate }: TaskSidebarProps) {
  const tasksForDate = mockTasks.filter((task) => isSameDay(task.dueDate, selectedDate))

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  }

  const statusColors = {
    todo: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    "in-progress": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    done: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  }

  return (
    <div className="w-80 border-l bg-background flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Tâches du jour</h2>
        </div>
        <p className="text-sm text-muted-foreground">{format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {tasksForDate.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Aucune tâche prévue pour cette date</p>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une tâche
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasksForDate.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
                    <div className="flex gap-1 ml-2">
                      <Badge variant="outline" className={priorityColors[task.priority]} size="sm">
                        {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
                      </Badge>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{task.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{task.project}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                      </div>

                      <Badge variant="outline" className={statusColors[task.status]} size="sm">
                        {task.status === "todo" ? "À faire" : task.status === "in-progress" ? "En cours" : "Terminé"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button className="w-full bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>
    </div>
  )
}
