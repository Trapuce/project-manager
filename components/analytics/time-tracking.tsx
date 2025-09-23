import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    name: "Site E-commerce",
    timeSpent: 142,
    timeEstimated: 160,
    progress: 89,
    status: "En cours",
  },
  {
    name: "App Mobile",
    timeSpent: 98,
    timeEstimated: 120,
    progress: 82,
    status: "En cours",
  },
  {
    name: "Refonte UI/UX",
    timeSpent: 156,
    timeEstimated: 150,
    progress: 104,
    status: "Dépassé",
  },
  {
    name: "API Backend",
    timeSpent: 67,
    timeEstimated: 100,
    progress: 67,
    status: "En cours",
  },
]

const statusColors = {
  "En cours": "default",
  Dépassé: "destructive",
  Terminé: "secondary",
} as const

export function TimeTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi du temps</CardTitle>
        <CardDescription>Temps passé vs estimé par projet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{project.name}</p>
                <p className="text-xs text-muted-foreground">
                  {project.timeSpent}h / {project.timeEstimated}h
                </p>
              </div>
              <Badge variant={statusColors[project.status as keyof typeof statusColors]}>{project.status}</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progression</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={Math.min(project.progress, 100)} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
