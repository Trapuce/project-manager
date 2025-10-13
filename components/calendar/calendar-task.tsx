"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, User, Target } from "lucide-react"
import type { Task } from "@/lib/api"

interface CalendarTaskProps {
  task: Task
  compact?: boolean
  detailed?: boolean
}

export function CalendarTask({ task, compact = false, detailed = false }: CalendarTaskProps) {
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

  if (compact) {
    return (
      <div className="text-xs p-1 rounded bg-primary/10 dark:bg-primary/20 text-primary truncate">
        {task.title}
      </div>
    )
  }

  if (detailed) {
    return (
      <div className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <div className="flex gap-1 ml-2">
            <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors])}>
              {getPriorityLabel(task.priority)}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", statusColors[task.status as keyof typeof statusColors])}>
              {getStatusLabel(task.status)}
            </Badge>
          </div>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            Projet #{task.projectId}
          </span>
          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="text-xs p-2 rounded bg-card border hover:bg-muted/50 transition-colors">
      <div className="font-medium truncate mb-1">{task.title}</div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground truncate">Projet #{task.projectId}</span>
        <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors])}>
          {task.priority === "HIGH" ? "H" : task.priority === "MEDIUM" ? "M" : "B"}
        </Badge>
      </div>
    </div>
  )
}