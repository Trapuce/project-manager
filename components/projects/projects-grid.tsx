import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, Users, Edit, Archive, Trash2 } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Site E-commerce",
    description: "Développement d'une plateforme de vente en ligne moderne avec paiement intégré",
    status: "En cours",
    priority: "Haute",
    progress: 75,
    dueDate: "2024-01-15",
    team: [
      { name: "Alice", avatar: "A" },
      { name: "Bob", avatar: "B" },
      { name: "Charlie", avatar: "C" },
    ],
    tasksCount: 24,
    completedTasks: 18,
  },
  {
    id: 2,
    name: "App Mobile",
    description: "Application mobile pour la gestion des tâches et collaboration d'équipe",
    status: "En cours",
    priority: "Moyenne",
    progress: 45,
    dueDate: "2024-02-01",
    team: [
      { name: "David", avatar: "D" },
      { name: "Eve", avatar: "E" },
    ],
    tasksCount: 16,
    completedTasks: 7,
  },
  {
    id: 3,
    name: "Refonte UI/UX",
    description: "Amélioration complète de l'interface utilisateur et expérience client",
    status: "Presque terminé",
    priority: "Haute",
    progress: 90,
    dueDate: "2023-12-20",
    team: [
      { name: "Frank", avatar: "F" },
      { name: "Grace", avatar: "G" },
    ],
    tasksCount: 12,
    completedTasks: 11,
  },
  {
    id: 4,
    name: "API Backend",
    description: "Développement de l'API REST pour les applications mobiles et web",
    status: "En cours",
    priority: "Haute",
    progress: 60,
    dueDate: "2024-01-30",
    team: [
      { name: "Henry", avatar: "H" },
      { name: "Iris", avatar: "I" },
      { name: "Jack", avatar: "J" },
    ],
    tasksCount: 20,
    completedTasks: 12,
  },
  {
    id: 5,
    name: "Dashboard Analytics",
    description: "Tableau de bord avec métriques et rapports en temps réel",
    status: "À faire",
    priority: "Moyenne",
    progress: 15,
    dueDate: "2024-03-15",
    team: [
      { name: "Kate", avatar: "K" },
      { name: "Liam", avatar: "L" },
    ],
    tasksCount: 8,
    completedTasks: 1,
  },
  {
    id: 6,
    name: "Migration Cloud",
    description: "Migration de l'infrastructure vers le cloud avec optimisation des coûts",
    status: "En pause",
    priority: "Basse",
    progress: 30,
    dueDate: "2024-04-01",
    team: [{ name: "Mike", avatar: "M" }],
    tasksCount: 15,
    completedTasks: 4,
  },
]

const statusColors = {
  "En cours": "default",
  "Presque terminé": "secondary",
  "À faire": "outline",
  "En pause": "destructive",
} as const

const priorityColors = {
  Haute: "destructive",
  Moyenne: "default",
  Basse: "secondary",
} as const

export function ProjectsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Link href={`/dashboard/projects/${project.id}`}>
                  <CardTitle className="hover:text-primary cursor-pointer">{project.name}</CardTitle>
                </Link>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="mr-2 h-4 w-4" />
                    Archiver
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={statusColors[project.status as keyof typeof statusColors]}>{project.status}</Badge>
              <Badge variant={priorityColors[project.priority as keyof typeof priorityColors]}>
                {project.priority}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progression</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {project.completedTasks}/{project.tasksCount} tâches terminées
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{project.dueDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.team.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
