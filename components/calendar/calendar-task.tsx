"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, User } from "lucide-react"

interface Task {
  id: string
  title: string
  project: string
  priority: "low" | "medium" | "high"
  dueDate: Date
  assignee: {
    name: string
    avatar: string
  }
}

interface CalendarTaskProps {
  task: Task
  compact?: boolean
  detailed?: boolean
}

export function CalendarTask({ task, compact = false, detailed = false }: CalendarTaskProps) {
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  }

  if (compact) {
    return (
      <div className="text-xs p-1 rounded bg-primary/10 dark:bg-primary/20 text-primary truncate">{task.title}</div>
    )
  }

  if (detailed) {
    return (
      <div className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
            {task.priority === "high" ? "Haute" : task.priority === "medium" ? "Moyenne" : "Basse"}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {task.project}
          </span>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{task.assignee.name}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-xs p-2 rounded bg-card border hover:bg-muted/50 transition-colors">
      <div className="font-medium truncate mb-1">{task.title}</div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground truncate">{task.project}</span>
        <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
          {task.priority === "high" ? "H" : task.priority === "medium" ? "M" : "B"}
        </Badge>
      </div>
    </div>
  )
}
