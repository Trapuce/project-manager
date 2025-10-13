"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, User, Users, AlertCircle, CheckCircle, Clock, Pause, Loader2 } from "lucide-react"
import { useProjectsStore } from "@/stores/projects-store"
import { ProjectsPagination } from "./projects-pagination-simple"
import { ProjectDetailsDialog } from "./project-details-dialog"
import { EditProjectDialog } from "./edit-project-dialog"
import type { Project } from "@/lib/api"

export function ProjectsGrid() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  
  const { 
    projects, 
    isLoading, 
    error, 
    loadProjects 
  } = useProjectsStore()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'ON_HOLD':
        return <Pause className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800'
      case 'PLANNING':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setIsDetailsOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setSelectedProject(project)
    setIsEditOpen(true)
  }

  const handleProjectUpdated = () => {
    loadProjects()
    setIsEditOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Chargement des projets...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">{error}</p>
          <Button onClick={loadProjects} variant="outline" size="sm">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucun projet trouvé</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {project.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description || 'Aucune description'}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(project)}>
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditProject(project)}>
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Statut et Priorité */}
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(project.status)} flex items-center gap-1`}>
                  {getStatusIcon(project.status)}
                  {project.status}
                </Badge>
                <Badge variant="outline" className={getPriorityColor(project.priority)}>
                  {project.priority}
                </Badge>
              </div>

              {/* Dates */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Début: {formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Échéance: {formatDate(project.dueDate)}</span>
                </div>
              </div>

              {/* Progression */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progression</span>
                  <span className="font-medium">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>

              {/* Équipe */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">U</AvatarFallback>
                  </Avatar>
                  <Avatar className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">+</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-sm text-muted-foreground">0 membres</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProjectsPagination />

      <ProjectDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        project={selectedProject}
      />

      <EditProjectDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        project={selectedProject}
        onProjectUpdated={handleProjectUpdated}
      />
    </>
  )
}