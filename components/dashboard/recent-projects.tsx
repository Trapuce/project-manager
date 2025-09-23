"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { projectsService, tasksService } from "@/lib/api"
import type { Project, Task } from "@/lib/api"
import { useRouter } from "next/navigation"

interface ProjectWithProgress extends Project {
  progress: number
  completedTasks: number
  totalTasks: number
}

export function RecentProjects() {
  const [projects, setProjects] = useState<ProjectWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const myProjects = await projectsService.getMyProjects({ size: 5 })
        
        // Calculer la progression pour chaque projet
        const projectsWithProgress = await Promise.all(
          myProjects.content.map(async (project) => {
            try {
              const projectTasks = await tasksService.getTasksByProject(project.id)
              const completedTasks = projectTasks.content.filter(task => task.status === 'COMPLETED').length
              const totalTasks = projectTasks.content.length
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
              
              return {
                ...project,
                progress,
                completedTasks,
                totalTasks,
              }
            } catch (error) {
              console.error(`Error loading tasks for project ${project.id}:`, error)
              return {
                ...project,
                progress: 0,
                completedTasks: 0,
                totalTasks: 0,
              }
            }
          })
        )
        
        setProjects(projectsWithProgress)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Badge variant="default">En cours</Badge>
      case 'COMPLETED':
        return <Badge variant="secondary">Terminé</Badge>
      case 'ON_HOLD':
        return <Badge variant="outline">En attente</Badge>
      case 'TODO':
        return <Badge variant="outline">À faire</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non définie'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const handleProjectClick = (projectId: number) => {
    router.push(`/dashboard/projects/${projectId}`)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projets récents</CardTitle>
          <CardDescription>Vos projets les plus actifs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-48 bg-muted animate-pulse rounded" />
              <div className="h-2 w-full bg-muted animate-pulse rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projets récents</CardTitle>
        <CardDescription>Vos projets les plus actifs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun projet trouvé
          </p>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id} 
              className="space-y-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                {getStatusBadge(project.status)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Progression</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Équipe: {project.members.map(m => `${m.firstName} ${m.lastName}`).join(", ")}</span>
                <span>Échéance: {formatDate(project.dueDate)}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
