"use client"

import { useState } from "react"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { TaskSidebar } from "@/components/calendar/task-sidebar"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog-simple"
import { SectionTransition, FadeInTransition } from "@/components/ui/section-transition"

function CalendarContent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <FadeInTransition>
          <CalendarHeader
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onCreateTask={() => setShowCreateDialog(true)}
          />
        </FadeInTransition>
        <SectionTransition delay={0.1}>
          <div className="flex-1 overflow-hidden">
            <CalendarGrid 
              selectedDate={selectedDate} 
              viewMode={viewMode} 
              onDateSelect={setSelectedDate} 
            />
          </div>
        </SectionTransition>
      </div>
      <SectionTransition delay={0.2}>
        <TaskSidebar 
          selectedDate={selectedDate} 
          onCreateTask={() => setShowCreateDialog(true)}
        />
      </SectionTransition>
      <CreateTaskDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onTaskCreated={() => setShowCreateDialog(false)}
      />
    </div>
  )
}

export default function CalendarPage() {
  return <CalendarContent />
}