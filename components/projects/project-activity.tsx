import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProjectActivityProps {
  projectId: string
}

const activities = [
  {
    id: 1,
    user: "Alice",
    avatar: "A",
    action: "a terminé la tâche",
    target: "Intégration API",
    time: "Il y a 2h",
  },
  {
    id: 2,
    user: "Bob",
    avatar: "B",
    action: "a commenté sur",
    target: "Design homepage",
    time: "Il y a 4h",
  },
  {
    id: 3,
    user: "Charlie",
    avatar: "C",
    action: "a créé la tâche",
    target: "Tests utilisateurs",
    time: "Il y a 1j",
  },
  {
    id: 4,
    user: "Alice",
    avatar: "A",
    action: "a mis à jour",
    target: "Statut du projet",
    time: "Il y a 2j",
  },
]

export function ProjectActivity({ projectId }: ProjectActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Dernières actions sur le projet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
