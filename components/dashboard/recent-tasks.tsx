import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const tasks = [
  {
    id: 1,
    title: "Intégrer l'API de paiement",
    project: "Site E-commerce",
    assignee: "Alice",
    priority: "Haute",
    status: "En cours",
    dueDate: "2023-12-18",
  },
  {
    id: 2,
    title: "Créer les maquettes mobile",
    project: "App Mobile",
    assignee: "David",
    priority: "Moyenne",
    status: "À faire",
    dueDate: "2023-12-20",
  },
  {
    id: 3,
    title: "Tests utilisateurs",
    project: "Refonte UI/UX",
    assignee: "Grace",
    priority: "Basse",
    status: "Terminé",
    dueDate: "2023-12-15",
  },
  {
    id: 4,
    title: "Optimisation des performances",
    project: "Site E-commerce",
    assignee: "Bob",
    priority: "Haute",
    status: "En cours",
    dueDate: "2023-12-19",
  },
]

const priorityColors = {
  Haute: "destructive",
  Moyenne: "default",
  Basse: "secondary",
} as const

const statusColors = {
  "À faire": "secondary",
  "En cours": "default",
  Terminé: "secondary",
} as const

export function RecentTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tâches récentes</CardTitle>
        <CardDescription>Dernières tâches assignées et mises à jour</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{task.assignee.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{task.title}</p>
                <p className="text-sm text-muted-foreground">
                  {task.project} • Échéance: {task.dueDate}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={priorityColors[task.priority as keyof typeof priorityColors]}>{task.priority}</Badge>
                <Badge variant={statusColors[task.status as keyof typeof statusColors]}>{task.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
