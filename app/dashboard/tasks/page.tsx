"use client"

import { useState, useEffect } from "react"
import { TasksHeader } from "@/components/tasks/tasks-header"
import { TasksGrid } from "@/components/tasks/tasks-grid-simple"
import { TasksList } from "@/components/tasks/tasks-list-simple"
import { TasksFilters } from "@/components/tasks/tasks-filters-simple"
import { useTasksStore } from "@/stores/tasks-store"
import { FadeTransition } from "@/components/ui/page-transition"
import { SectionTransition, FadeInTransition } from "@/components/ui/section-transition"

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    projectFilter,
    assignedToFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    setProjectFilter,
    setAssignedToFilter,
    clearFilters,
    loadTasks,
    loadStats,
  } = useTasksStore()

  // Charger les données au montage
  useEffect(() => {
    loadTasks()
    loadStats()
  }, [loadTasks, loadStats])

  const filters = {
    search: searchQuery,
    status: statusFilter,
    priority: priorityFilter,
    projectId: projectFilter,
    assignedToId: assignedToFilter,
  }

  const handleFiltersChange = (newFilters: any) => {
    if (newFilters.search !== undefined) setSearchQuery(newFilters.search)
    if (newFilters.status !== undefined) setStatusFilter(newFilters.status)
    if (newFilters.priority !== undefined) setPriorityFilter(newFilters.priority)
    if (newFilters.projectId !== undefined) setProjectFilter(newFilters.projectId)
    if (newFilters.assignedToId !== undefined) setAssignedToFilter(newFilters.assignedToId)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <FadeInTransition>
        <TasksHeader 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </FadeInTransition>
      
      <SectionTransition delay={0.1}>
        <TasksFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />
      </SectionTransition>
      
      <FadeTransition isVisible={viewMode === "grid"}>
        <TasksGrid />
      </FadeTransition>
      
      <FadeTransition isVisible={viewMode === "list"}>
        <TasksList />
      </FadeTransition>
    </div>
  )
}