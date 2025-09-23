import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    action: "Projet créé",
    target: "Site E-commerce",
    date: "Il y a 2 jours",
    type: "project",
  },
  {
    id: 2,
    action: "Tâche terminée",
    target: "Intégration API",
    date: "Il y a 3 jours",
    type: "task",
  },
  {
    id: 3,
    action: "Commentaire ajouté",
    target: "Bug fix login",
    date: "Il y a 5 jours",
    type: "comment",
  },
  {
    id: 4,
    action: "Utilisateur invité",
    target: "Marie Martin",
    date: "Il y a 1 semaine",
    type: "user",
  },
  {
    id: 5,
    action: "Projet archivé",
    target: "Ancien site",
    date: "Il y a 2 semaines",
    type: "project",
  },
]

const typeColors = {
  project: "default",
  task: "secondary",
  comment: "outline",
  user: "destructive",
} as const

export function ProfileActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Vos dernières actions dans l'application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Badge variant={typeColors[activity.type as keyof typeof typeColors]} className="mt-1">
              {activity.type}
            </Badge>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.action}</span>{" "}
                <span className="text-muted-foreground">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.date}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
