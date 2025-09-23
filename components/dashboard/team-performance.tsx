import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const teamMembers = [
  {
    id: 1,
    name: "Alice Dupont",
    avatar: "A",
    role: "Chef de projet",
    tasksCompleted: 24,
    tasksTotal: 28,
    efficiency: 86,
    trend: "up",
  },
  {
    id: 2,
    name: "Bob Martin",
    avatar: "B",
    role: "Développeur",
    tasksCompleted: 31,
    tasksTotal: 35,
    efficiency: 89,
    trend: "up",
  },
  {
    id: 3,
    name: "Charlie Bernard",
    avatar: "C",
    role: "Designer",
    tasksCompleted: 18,
    tasksTotal: 22,
    efficiency: 82,
    trend: "stable",
  },
  {
    id: 4,
    name: "David Petit",
    avatar: "D",
    role: "Développeur",
    tasksCompleted: 15,
    tasksTotal: 20,
    efficiency: 75,
    trend: "down",
  },
]

const trendColors = {
  up: "text-green-600",
  stable: "text-blue-600",
  down: "text-red-600",
}

export function TeamPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance de l'équipe</CardTitle>
        <CardDescription>Efficacité et progression des membres</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={trendColors[member.trend as keyof typeof trendColors]}>
                  {member.efficiency}%
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {member.tasksCompleted}/{member.tasksTotal} tâches
                </span>
                <span>{member.efficiency}%</span>
              </div>
              <Progress value={member.efficiency} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
