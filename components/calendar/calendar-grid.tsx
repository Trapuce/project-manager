"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarTask } from "./calendar-task"
import { tasksService } from "@/lib/api"
import { useTasksStore } from "@/stores/tasks-store"
import { enhancedToast } from "@/components/ui/enhanced-toast"
import type { Task } from "@/lib/api"

interface CalendarGridProps {
  selectedDate: Date
  viewMode: "month" | "week" | "day"
  onDateSelect: (date: Date) => void
}

export function CalendarGrid({ selectedDate, viewMode, onDateSelect }: CalendarGridProps) {
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

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={loadTasks}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (viewMode === "month") {
    return <MonthView selectedDate={selectedDate} onDateSelect={onDateSelect} getTasksForDate={getTasksForDate} />
  } else if (viewMode === "week") {
    return <WeekView selectedDate={selectedDate} onDateSelect={onDateSelect} getTasksForDate={getTasksForDate} />
  } else {
    return <DayView selectedDate={selectedDate} onDateSelect={onDateSelect} getTasksForDate={getTasksForDate} />
  }
}

function MonthView({ 
  selectedDate, 
  onDateSelect, 
  getTasksForDate 
}: { 
  selectedDate: Date
  onDateSelect: (date: Date) => void
  getTasksForDate: (date: Date) => Task[]
}) {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  return (
    <div className="flex flex-col h-full">
      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-sm font-medium text-muted-foreground text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day) => {
          const tasksForDay = getTasksForDate(day)
          const isCurrentMonth = isSameMonth(day, selectedDate)
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-b p-2 min-h-[120px] cursor-pointer hover:bg-muted/50 transition-colors",
                !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                isSelected && "bg-primary/10 dark:bg-primary/20",
                isCurrentDay && "bg-blue-50 dark:bg-blue-950/20",
              )}
              onClick={() => onDateSelect(day)}
            >
              <div className={cn("text-sm font-medium mb-1", isCurrentDay && "text-primary")}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {tasksForDay.slice(0, 3).map((task) => (
                  <CalendarTask key={task.id} task={task} compact />
                ))}
                {tasksForDay.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{tasksForDay.length - 3} autres</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ 
  selectedDate, 
  onDateSelect, 
  getTasksForDate 
}: { 
  selectedDate: Date
  onDateSelect: (date: Date) => void
  getTasksForDate: (date: Date) => Task[]
}) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors",
              isSameDay(day, selectedDate) && "bg-primary/10 dark:bg-primary/20",
              isToday(day) && "bg-blue-50 dark:bg-blue-950/20",
            )}
            onClick={() => onDateSelect(day)}
          >
            <div className="text-sm text-muted-foreground">{format(day, "EEE", { locale: fr })}</div>
            <div className={cn("text-lg font-semibold", isToday(day) && "text-primary")}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1">
        {days.map((day) => {
          const tasksForDay = getTasksForDate(day)

          return (
            <div key={day.toISOString()} className="border-r p-3 space-y-2">
              {tasksForDay.map((task) => (
                <CalendarTask key={task.id} task={task} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayView({ 
  selectedDate, 
  onDateSelect, 
  getTasksForDate 
}: { 
  selectedDate: Date
  onDateSelect: (date: Date) => void
  getTasksForDate: (date: Date) => Task[]
}) {
  const tasksForDay = getTasksForDate(selectedDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          {format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })}
        </h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-px">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b">
              <div className="w-16 p-2 text-sm text-muted-foreground text-right">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 p-2 min-h-[60px]">
                {/* Ici on pourrait afficher les tâches par heure si on avait des heures spécifiques */}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-3">Tâches du jour ({tasksForDay.length})</h3>
          <div className="space-y-2">
            {tasksForDay.map((task) => (
              <CalendarTask key={task.id} task={task} detailed />
            ))}
            {tasksForDay.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucune tâche prévue pour cette date
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}