import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "Alice",
    action: "a terminé la tâche",
    target: "Intégration Stripe",
    time: "Il y a 2h",
    type: "task_completed",
  },
  {
    id: 2,
    user: "Bob",
    action: "a créé le projet",
    target: "Dashboard Analytics",
    time: "Il y a 4h",
    type: "project_created",
  },
  {
    id: 3,
    user: "Charlie",
    action: "a commenté sur",
    target: "Bug fix login",
    time: "Il y a 6h",
    type: "comment_added",
  },
  {
    id: 4,
    user: "David",
    action: "a assigné la tâche",
    target: "Tests unitaires",
    time: "Il y a 1j",
    type: "task_assigned",
  },
  {
    id: 5,
    user: "Eve",
    action: "a mis à jour",
    target: "Roadmap Q1",
    time: "Il y a 1j",
    type: "project_updated",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Dernières actions de l'équipe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{activity.user.charAt(0)}</AvatarFallback>
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
