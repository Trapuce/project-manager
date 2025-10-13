"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { 
  FolderOpen, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Target
} from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { projectsService } from "@/lib/api"
import { useState, useEffect } from "react"
import type { ProjectStats } from "@/lib/api"

export function ProjectsStats() {
  const { projects, isLoading } = useProjects()
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true)
        const statsData = await projectsService.getProjectStats()
        setStats(statsData)
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
        // Calculer les stats localement si l'API échoue
        const localStats = calculateLocalStats(projects)
        setStats(localStats)
      } finally {
        setIsLoadingStats(false)
      }
    }

    if (projects.length > 0) {
      loadStats()
    }
  }, [projects])

  const calculateLocalStats = (projects: any[]): ProjectStats => {
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length
    const inProgressProjects = projects.filter(p => p.status === 'IN_PROGRESS').length
    const onHoldProjects = projects.filter(p => p.status === 'ON_HOLD').length
    const totalTasks = projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0)
    const completedTasks = projects.reduce((sum, p) => 
      sum + (p.tasks?.filter(t => t.status === 'COMPLETED').length || 0), 0
    )
    const totalMembers = projects.reduce((sum, p) => sum + (p.members?.length || 0), 0)
    const overdueProjects = projects.filter(p => 
      new Date(p.dueDate) < new Date() && p.status !== 'COMPLETED'
    ).length

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      onHoldProjects,
      totalTasks,
      completedTasks,
      totalMembers,
      overdueProjects,
      averageCompletionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
    }
  }

  if (isLoading || isLoadingStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <LoadingSkeleton className="h-4 w-24" />
              </CardTitle>
              <LoadingSkeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <LoadingSkeleton className="h-8 w-16 mb-2" />
              <LoadingSkeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Valeurs par défaut pour éviter les erreurs
  const defaultStats = {
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    onHoldProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalMembers: 0,
    overdueProjects: 0,
    averageCompletionRate: 0
  }

  // Calculer les stats ou utiliser les valeurs par défaut
  const currentStats = stats || (projects.length > 0 ? calculateLocalStats(projects) : defaultStats)
  const safeStats = {
    totalProjects: currentStats?.totalProjects ?? 0,
    completedProjects: currentStats?.completedProjects ?? 0,
    inProgressProjects: currentStats?.inProgressProjects ?? 0,
    onHoldProjects: currentStats?.onHoldProjects ?? 0,
    totalTasks: currentStats?.totalTasks ?? 0,
    completedTasks: currentStats?.completedTasks ?? 0,
    totalMembers: currentStats?.totalMembers ?? 0,
    overdueProjects: currentStats?.overdueProjects ?? 0,
    averageCompletionRate: currentStats?.averageCompletionRate ?? 0
  }

  const statsCards = [
    {
      title: "Projets totaux",
      value: safeStats.totalProjects.toString(),
      description: `${safeStats.completedProjects} terminés`,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "En cours",
      value: safeStats.inProgressProjects.toString(),
      description: `${safeStats.onHoldProjects} en pause`,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Tâches",
      value: safeStats.totalTasks.toString(),
      description: `${safeStats.completedTasks} terminées`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "En retard",
      value: safeStats.overdueProjects.toString(),
      description: "Nécessitent attention",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques détaillées */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Taux de completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Taux de Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Projets terminés</span>
                <span className="text-2xl font-bold text-green-600">
                  {safeStats.averageCompletionRate}%
                </span>
              </div>
              <Progress value={safeStats.averageCompletionRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{safeStats.completedProjects} terminés</span>
                <span>{safeStats.totalProjects} au total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Répartition des tâches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Répartition des Tâches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tâches terminées</span>
                <span className="text-2xl font-bold text-green-600">
                  {safeStats.totalTasks > 0 ? Math.round((safeStats.completedTasks / safeStats.totalTasks) * 100) : 0}%
                </span>
              </div>
              <Progress 
                value={safeStats.totalTasks > 0 ? (safeStats.completedTasks / safeStats.totalTasks) * 100 : 0} 
                className="h-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{safeStats.completedTasks} terminées</span>
                <span>{safeStats.totalTasks} au total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes */}
      {safeStats.overdueProjects > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Projets en Retard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {safeStats.overdueProjects} projet{safeStats.overdueProjects > 1 ? 's' : ''} 
              {' '}en retard nécessitent votre attention.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}