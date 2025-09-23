"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Calendar, Grid3X3, List } from "lucide-react"
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns"
import { fr } from "date-fns/locale"

interface CalendarHeaderProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  viewMode: "month" | "week" | "day"
  setViewMode: (mode: "month" | "week" | "day") => void
  onCreateTask: () => void
}

export function CalendarHeader({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  onCreateTask,
}: CalendarHeaderProps) {
  const navigatePrevious = () => {
    if (viewMode === "month") {
      setSelectedDate(subMonths(selectedDate, 1))
    } else if (viewMode === "week") {
      setSelectedDate(subWeeks(selectedDate, 1))
    } else {
      setSelectedDate(subDays(selectedDate, 1))
    }
  }

  const navigateNext = () => {
    if (viewMode === "month") {
      setSelectedDate(addMonths(selectedDate, 1))
    } else if (viewMode === "week") {
      setSelectedDate(addWeeks(selectedDate, 1))
    } else {
      setSelectedDate(addDays(selectedDate, 1))
    }
  }

  const getDateTitle = () => {
    if (viewMode === "month") {
      return format(selectedDate, "MMMM yyyy", { locale: fr })
    } else if (viewMode === "week") {
      return `Semaine du ${format(selectedDate, "dd MMM yyyy", { locale: fr })}`
    } else {
      return format(selectedDate, "dd MMMM yyyy", { locale: fr })
    }
  }

  return (
    <div className="flex items-center justify-between p-6 border-b bg-background">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-balance">{getDateTitle()}</h1>
        <Button variant="outline" onClick={() => setSelectedDate(new Date())} className="text-sm">
          Aujourd'hui
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="h-8"
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Mois
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("week")}
            className="h-8"
          >
            <List className="h-4 w-4 mr-1" />
            Semaine
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("day")}
            className="h-8"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Jour
          </Button>
        </div>

        <Button onClick={onCreateTask} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>
    </div>
  )
}
