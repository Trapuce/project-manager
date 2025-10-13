"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  User, 
  Users, 
  CheckCircle, 
  Clock, 
  Pause, 
  AlertCircle,
  FileText,
  Target,
  Edit,
  Trash2
} from "lucide-react"
import { projectsService, tasksService, usersService } from "@/lib/api"
import { enhancedToast } from "@/components/ui/enhanced-toast"
import { useProjectsStore } from "@/stores/projects-store"
import type { Project, Task, User } from "@/lib/api"

interface ProjectDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: number | null
  onEdit?: (project: Project) => void
  onDelete?: (projectId: number) => void
}

export function ProjectDetailsDialog({ 
  open, 
  onOpenChange, 
  projectId, 
  onEdit, 
  onDelete 
}: ProjectDetailsDialogProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { loadProjects } = useProjectsStore()

  useEffect(() => {
    if (open && projectId) {
      loadProjectDetails()
    }
  }, [open, projectId])

  const loadProjectDetails = async () => {
    if (!projectId) return

    setIsLoading(true)
    try {
      // Charger les détails du projet
      const projectData = await projectsService.getProjectById(projectId)
      setProject(projectData)

      // Charger les tâches du projet
      try {
        const tasksData = await tasksService.getTasksByProject(projectId)
        setTasks(tasksData.content || [])
      } catch (error) {
        console.error("Erreur lors du chargement des tâches:", error)
        setTasks([])
      }

      // Charger les membres du projet
      if (projectData.members && projectData.members.length > 0) {
        try {
          const memberPromises = projectData.members.map(member => 
            usersService.getUserById(member.id)
          )
          const membersData = await Promise.all(memberPromises)
          setMembers(membersData.filter(Boolean))
        } catch (error) {
          console.error("Erreur lors du chargement des membres:", error)
          setMembers([])
        }
      } else {
        setMembers([])
      }

    } catch (error) {
      console.error("Erreur lors du chargement des détails du projet:", error)
      enhancedToast.error("Erreur lors du chargement des détails du projet", {
        description: error instanceof Error ? error.message : "Erreur inconnue"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!project || !onDelete) return

    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ? Cette action est irréversible.`)) {
      try {
        await projectsService.deleteProject(project.id)
        enhancedToast.success("Projet supprimé avec succès !")
        onDelete(project.id)
        onOpenChange(false)
        loadProjects()
      } catch (error) {
        enhancedToast.error("Erreur lors de la suppression du projet", {
          description: error instanceof Error ? error.message : "Erreur inconnue"
        })
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'ON_HOLD':
        return <Pause className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!project) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{project.name}</DialogTitle>
              <DialogDescription className="mt-2">
                Détails complets du projet
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="tasks">Tâches ({tasks.length})</TabsTrigger>
              <TabsTrigger value="members">Membres ({members.length})</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Statut</label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Priorité</label>
                      <div className="mt-1">
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {project.description && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="mt-1 text-sm">{project.description}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Progression</label>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress || 0} className="flex-1" />
                      <span className="text-sm font-medium">{project.progress || 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dates et propriétaire */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Dates et propriétaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date de début</label>
                      <p className="mt-1 text-sm">{formatDate(project.startDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date d'échéance</label>
                      <p className="mt-1 text-sm">{formatDate(project.dueDate)}</p>
                    </div>
                  </div>
                  
                  {project.owner && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Propriétaire</label>
                      <div className="mt-1 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {project.owner.firstName?.charAt(0)}{project.owner.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {project.owner.firstName} {project.owner.lastName}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">Aucune tâche</h3>
                  <p className="text-sm text-muted-foreground">Ce projet n'a pas encore de tâches.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">Aucun membre</h3>
                  <p className="text-sm text-muted-foreground">Ce projet n'a pas encore de membres assignés.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {members.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              {member.firstName} {member.lastName}
                            </h4>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <Badge variant="outline" className="mt-1">
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Détails techniques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ID du projet</label>
                      <p className="mt-1 text-sm font-mono">{project.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date de création</label>
                      <p className="mt-1 text-sm">{formatDate(project.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Dernière modification</label>
                      <p className="mt-1 text-sm">{formatDate(project.updatedAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nombre de tâches</label>
                      <p className="mt-1 text-sm">{tasks.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
