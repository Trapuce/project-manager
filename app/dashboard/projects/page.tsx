"use client"

import { useState, useEffect } from "react"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsGrid } from "@/components/projects/projects-grid-simple"
import { ProjectsList } from "@/components/projects/projects-list-simple"
import { ProjectsFilters } from "@/components/projects/projects-filters-simple"
import { useProjectsStore } from "@/stores/projects-store"
import { FadeTransition } from "@/components/ui/page-transition"
import { SectionTransition, FadeInTransition } from "@/components/ui/section-transition"

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    clearFilters,
    loadProjects,
    loadStats,
  } = useProjectsStore()

  // Charger les données au montage
  useEffect(() => {
    loadProjects()
    loadStats()
  }, [loadProjects, loadStats])

  const filters = {
    search: searchQuery,
    status: statusFilter,
    priority: priorityFilter,
  }

  const handleFiltersChange = (newFilters: any) => {
    if (newFilters.search !== undefined) setSearchQuery(newFilters.search)
    if (newFilters.status !== undefined) setStatusFilter(newFilters.status)
    if (newFilters.priority !== undefined) setPriorityFilter(newFilters.priority)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <FadeInTransition>
        <ProjectsHeader 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </FadeInTransition>
      
      <SectionTransition delay={0.1}>
        <ProjectsFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          onClearFilters={clearFilters}
        />
      </SectionTransition>
      
      <FadeTransition isVisible={viewMode === "grid"}>
        <ProjectsGrid />
      </FadeTransition>
      
      <FadeTransition isVisible={viewMode === "list"}>
        <ProjectsList />
      </FadeTransition>
    </div>
  )
}