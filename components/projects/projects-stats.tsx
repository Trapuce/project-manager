import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen, CheckCircle, Clock, Archive } from "lucide-react"

const stats = [
  {
    title: "Projets actifs",
    value: "12",
    description: "+2 ce mois",
    icon: FolderOpen,
    color: "text-blue-600",
  },
  {
    title: "Projets terminés",
    value: "8",
    description: "Ce trimestre",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "En retard",
    value: "3",
    description: "Nécessitent attention",
    icon: Clock,
    color: "text-red-600",
  },
  {
    title: "Archivés",
    value: "15",
    description: "Total",
    icon: Archive,
    color: "text-gray-600",
  },
]

export function ProjectsStats() {
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
