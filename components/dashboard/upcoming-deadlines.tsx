import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, AlertTriangle } from "lucide-react"

const upcomingItems = [
  {
    id: 1,
    title: "Intégration API Stripe",
    type: "task",
    project: "Site E-commerce",
    assignee: { name: "Alice", avatar: "A" },
    dueDate: "2023-12-20",
    daysLeft: 2,
    priority: "Haute",
    status: "urgent",
  },
  {
    id: 2,
    title: "Tests utilisateurs",
    type: "task",
    project: "Refonte UI/UX",
    assignee: { name: "Grace", avatar: "G" },
    dueDate: "2023-12-22",
    daysLeft: 4,
    priority: "Moyenne",
    status: "warning",
  },
  {
    id: 3,
    title: "Site E-commerce",
    type: "project",
    project: null,
    assignee: { name: "Équipe", avatar: "E" },
    dueDate: "2024-01-15",
    daysLeft: 28,
    priority: "Haute",
    status: "normal",
  },
  {
    id: 4,
    title: "Documentation API",
    type: "task",
    project: "API Backend",
    assignee: { name: "Henry", avatar: "H" },
    dueDate: "2023-12-25",
    daysLeft: 7,
    priority: "Moyenne",
    status: "normal",
  },
]

const statusColors = {
  urgent: "destructive",
  warning: "default",
  normal: "secondary",
} as const

const statusIcons = {
  urgent: AlertTriangle,
  warning: Clock,
  normal: Calendar,
}

export function UpcomingDeadlines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Échéances à venir</CardTitle>
        <CardDescription>Projets et tâches à surveiller</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingItems.map((item) => {
          const StatusIcon = statusIcons[item.status as keyof typeof statusIcons]
          return (
            <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <StatusIcon
                className={`h-4 w-4 mt-1 ${item.status === "urgent" ? "text-red-500" : item.status === "warning" ? "text-orange-500" : "text-muted-foreground"}`}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.project && <p className="text-xs text-muted-foreground">{item.project}</p>}
                  </div>
                  <Badge variant={statusColors[item.status as keyof typeof statusColors]}>{item.daysLeft}j</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">{item.assignee.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{item.assignee.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {item.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
