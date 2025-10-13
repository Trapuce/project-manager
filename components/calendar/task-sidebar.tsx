"use client"

import { useState, useEffect } from "react"
import { format, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, Plus, Target, User } from "lucide-react"
import { tasksService } from "@/lib/api"
import { useTasksStore } from "@/stores/tasks-store"
import { enhancedToast } from "@/components/ui/enhanced-toast"
import type { Task } from "@/lib/api"

interface TaskSidebarProps {
  selectedDate: Date
  onCreateTask: () => void
}

export function TaskSidebar({ selectedDate, onCreateTask }: TaskSidebarProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { loadTasks: refreshTasks } = useTasksStore()

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await tasksService.getAllTasks({ page: 0, size: 1000 })
      setTasks(response.content || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des tâches'
      setError(errorMessage)
      enhancedToast.error('Erreur lors du chargement des tâches', {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const tasksForDate = tasks.filter((task) => isSameDay(new Date(task.dueDate), selectedDate))

  const priorityColors = {
    LOW: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  }

  const statusColors = {
    PENDING: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    IN_PROGRESS: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'Haute'
      case 'MEDIUM': return 'Moyenne'
      case 'LOW': return 'Basse'
      default: return priority
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente'
      case 'IN_PROGRESS': return 'En cours'
      case 'COMPLETED': return 'Terminé'
      case 'CANCELLED': return 'Annulé'
      default: return status
    }
  }

  return (
    <div className="w-80 border-l bg-background flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Tâches du jour</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button size="sm" variant="outline" onClick={loadTasks}>
                Réessayer
              </Button>
            </div>
          ) : tasksForDate.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Aucune tâche prévue pour cette date</p>
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onCreateTask}>
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
                      <Badge 
                        variant="outline" 
                        className={priorityColors[task.priority as keyof typeof priorityColors]} 
                        size="sm"
                      >
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>Projet #{task.projectId}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      {task.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {task.assignedTo.firstName?.charAt(0)}{task.assignedTo.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {task.assignedTo.firstName} {task.assignedTo.lastName}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Non assigné</span>
                        </div>
                      )}

                      <Badge 
                        variant="outline" 
                        className={statusColors[task.status as keyof typeof statusColors]} 
                        size="sm"
                      >
                        {getStatusLabel(task.status)}
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
        <Button className="w-full bg-primary hover:bg-primary/90" onClick={onCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>
    </div>
  )
}