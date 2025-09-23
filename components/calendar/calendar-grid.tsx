"use client"
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
} from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { CalendarTask } from "./calendar-task"

interface CalendarGridProps {
  selectedDate: Date
  viewMode: "month" | "week" | "day"
  onDateSelect: (date: Date) => void
}

// Mock data pour les tâches
const mockTasks = [
  {
    id: "1",
    title: "Révision du design",
    project: "Site Web",
    priority: "high" as const,
    dueDate: new Date(2024, 11, 15),
    assignee: { name: "Marie Dubois", avatar: "/placeholder.svg?height=24&width=24" },
  },
  {
    id: "2",
    title: "Réunion équipe",
    project: "App Mobile",
    priority: "medium" as const,
    dueDate: new Date(2024, 11, 16),
    assignee: { name: "Pierre Martin", avatar: "/placeholder.svg?height=24&width=24" },
  },
  {
    id: "3",
    title: "Tests utilisateurs",
    project: "Dashboard",
    priority: "low" as const,
    dueDate: new Date(2024, 11, 18),
    assignee: { name: "Sophie Chen", avatar: "/placeholder.svg?height=24&width=24" },
  },
]

export function CalendarGrid({ selectedDate, viewMode, onDateSelect }: CalendarGridProps) {
  if (viewMode === "month") {
    return <MonthView selectedDate={selectedDate} onDateSelect={onDateSelect} />
  } else if (viewMode === "week") {
    return <WeekView selectedDate={selectedDate} onDateSelect={onDateSelect} />
  } else {
    return <DayView selectedDate={selectedDate} onDateSelect={onDateSelect} />
  }
}

function MonthView({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  const getTasksForDate = (date: Date) => {
    return mockTasks.filter((task) => isSameDay(task.dueDate, date))
  }

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
              <div className={cn("text-sm font-medium mb-1", isCurrentDay && "text-primary")}>{format(day, "d")}</div>
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

function WeekView({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getTasksForDate = (date: Date) => {
    return mockTasks.filter((task) => isSameDay(task.dueDate, date))
  }

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
            <div className={cn("text-lg font-semibold", isToday(day) && "text-primary")}>{format(day, "d")}</div>
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

function DayView({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) {
  const tasksForDay = mockTasks.filter((task) => isSameDay(task.dueDate, selectedDate))
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })}</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-px">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b">
              <div className="w-16 p-2 text-sm text-muted-foreground text-right">
                {hour.toString().padStart(2, "0")}:00
              </div>
              <div className="flex-1 p-2 min-h-[60px]">{/* Ici on pourrait afficher les tâches par heure */}</div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-3">Tâches du jour</h3>
          <div className="space-y-2">
            {tasksForDay.map((task) => (
              <CalendarTask key={task.id} task={task} detailed />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
