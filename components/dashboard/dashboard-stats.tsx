"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, CheckCircle, Clock, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { projectsService, tasksService, usersService } from "@/lib/api"
import type { ProjectStats, TaskStats, UserStats } from "@/lib/api"

export function DashboardStats() {
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null)
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projects, tasks, users] = await Promise.all([
          projectsService.getProjectStats(),
          tasksService.getTaskStats(),
          usersService.getUserStats(),
        ])
        
        setProjectStats(projects)
        setTaskStats(tasks)
        setUserStats(users)
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calculer le total des projets
  const totalProjects = projectStats ? 
    (projectStats.todo || 0) + 
    (projectStats.in_progress || 0) + 
    (projectStats.on_hold || 0) + 
    (projectStats.completed || 0) + 
    (projectStats.archived || 0) : 0

  // Calculer le total des tâches
  const totalTasks = taskStats ? 
    (taskStats.todo || 0) + 
    (taskStats.in_progress || 0) + 
    (taskStats.on_hold || 0) + 
    (taskStats.completed || 0) : 0

  const stats = [
    {
      title: "Projets actifs",
      value: totalProjects.toString(),
      description: `${projectStats?.in_progress || 0} en cours`,
      icon: FolderOpen,
      color: "text-blue-600",
    },
    {
      title: "Tâches terminées",
      value: (taskStats?.completed || 0).toString(),
      description: `${totalTasks} au total`,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Tâches en cours",
      value: (taskStats?.in_progress || 0).toString(),
      description: `${taskStats?.todo || 0} à faire`,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Membres d'équipe",
      value: (userStats?.active || 0).toString(),
      description: `${(userStats?.active || 0) + (userStats?.inactive || 0) + (userStats?.pending || 0)} au total`,
      icon: Users,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
