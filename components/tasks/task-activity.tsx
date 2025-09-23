import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TaskActivityProps {
  taskId: string
}

const activities = [
  {
    id: 1,
    user: { name: "Alice", avatar: "A" },
    action: "a modifié le statut",
    details: "À faire → En cours",
    timestamp: "Il y a 1h",
    type: "status_change",
  },
  {
    id: 2,
    user: { name: "Bob", avatar: "B" },
    action: "a ajouté un commentaire",
    details: null,
    timestamp: "Il y a 2h",
    type: "comment",
  },
  {
    id: 3,
    user: { name: "Alice", avatar: "A" },
    action: "a ajouté une pièce jointe",
    details: "stripe-integration-spec.pdf",
    timestamp: "Il y a 3h",
    type: "attachment",
  },
  {
    id: 4,
    user: { name: "Charlie", avatar: "C" },
    action: "a assigné la tâche à",
    details: "Alice Dupont",
    timestamp: "Il y a 1j",
    type: "assignment",
  },
]

const typeColors = {
  status_change: "default",
  comment: "secondary",
  attachment: "outline",
  assignment: "destructive",
} as const

export function TaskActivity({ taskId }: TaskActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité</CardTitle>
        <CardDescription>Historique des modifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{activity.user.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant={typeColors[activity.type as keyof typeof typeColors]} className="text-xs">
                  {activity.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.details && <span className="font-medium"> {activity.details}</span>}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
