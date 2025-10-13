"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Grid, List } from "lucide-react"
import { CreateTaskDialog } from "./create-task-dialog-simple"

interface TasksHeaderProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}

export function TasksHeader({ viewMode, onViewModeChange }: TasksHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleTaskCreated = () => {
    setIsCreateDialogOpen(false)
    // Le store se met à jour automatiquement
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tâches</h1>
          <p className="text-muted-foreground">Gérez toutes vos tâches et leur progression</p>
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
            Nouvelle tâche
          </Button>
        </div>
      </div>

      <CreateTaskDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onTaskCreated={handleTaskCreated}
      />
    </>
  )
}