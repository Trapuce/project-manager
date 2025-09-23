import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar } from "lucide-react"

interface ProjectTasksProps {
  projectId: string
}

const tasks = [
  {
    id: 1,
    title: "Intégrer l'API de paiement Stripe",
    description: "Configurer et tester les paiements en ligne",
    status: "En cours",
    priority: "Haute",
    assignee: { name: "Alice", avatar: "A" },
    dueDate: "2023-12-20",
    completed: false,
  },
  {
    id: 2,
    title: "Créer les pages produits",
    description: "Design et développement des pages de détail produit",
    status: "Terminé",
    priority: "Moyenne",
    assignee: { name: "Bob", avatar: "B" },
    dueDate: "2023-12-15",
    completed: true,
  },
  {
    id: 3,
    title: "Optimiser les performances",
    description: "Améliorer les temps de chargement et SEO",
    status: "À faire",
    priority: "Moyenne",
    assignee: { name: "Charlie", avatar: "C" },
    dueDate: "2023-12-25",
    completed: false,
  },
  {
    id: 4,
    title: "Tests utilisateurs",
    description: "Organiser et analyser les retours utilisateurs",
    status: "À faire",
    priority: "Basse",
    assignee: { name: "Alice", avatar: "A" },
    dueDate: "2023-12-30",
    completed: false,
  },
]

const statusColors = {
  "À faire": "secondary",
  "En cours": "default",
  Terminé: "secondary",
} as const

const priorityColors = {
  Haute: "destructive",
  Moyenne: "default",
  Basse: "secondary",
} as const

export function ProjectTasks({ projectId }: ProjectTasksProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tâches du projet</CardTitle>
            <CardDescription>Gérez les tâches et suivez leur progression</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start space-x-4 p-4 border rounded-lg">
            <Checkbox checked={task.completed} className="mt-1" />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>{task.priority}</Badge>
                  <Badge variant={statusColors[task.status as keyof typeof statusColors]}>{task.status}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
