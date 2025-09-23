"use client"

import { useState } from "react"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { TaskSidebar } from "@/components/calendar/task-sidebar"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <CalendarHeader
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCreateTask={() => setShowCreateDialog(true)}
        />
        <div className="flex-1 overflow-hidden">
          <CalendarGrid selectedDate={selectedDate} viewMode={viewMode} onDateSelect={setSelectedDate} />
        </div>
      </div>
      <TaskSidebar selectedDate={selectedDate} />
      <CreateTaskDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} defaultDate={selectedDate} />
    </div>
  )
}
