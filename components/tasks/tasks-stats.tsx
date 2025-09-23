import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle, Users } from "lucide-react"

const stats = [
  {
    title: "Tâches terminées",
    value: "89",
    description: "+12 cette semaine",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "En cours",
    value: "24",
    description: "À traiter",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    title: "En retard",
    value: "7",
    description: "Nécessitent attention",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    title: "Assignées à moi",
    value: "15",
    description: "Mes tâches actives",
    icon: Users,
    color: "text-purple-600",
  },
]

export function TasksStats() {
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
