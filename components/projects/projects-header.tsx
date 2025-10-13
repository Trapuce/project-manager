"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Grid, List } from "lucide-react"
import { CreateProjectDialog } from "./create-project-dialog-form"

interface ProjectsHeaderProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function ProjectsHeader({ viewMode, onViewModeChange }: ProjectsHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleProjectCreated = () => {
    setIsCreateDialogOpen(false)
    // Le store se met à jour automatiquement
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">Gérez tous vos projets en cours et archivés</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau projet
          </Button>
        </div>
      </div>

      <CreateProjectDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </>
  )
}
