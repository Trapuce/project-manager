import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProjectTeamProps {
  projectId: string
}

const teamMembers = [
  {
    id: 1,
    name: "Alice Dupont",
    role: "Chef de projet",
    avatar: "A",
    tasksCount: 8,
    completedTasks: 6,
  },
  {
    id: 2,
    name: "Bob Martin",
    role: "Développeur",
    avatar: "B",
    tasksCount: 12,
    completedTasks: 9,
  },
  {
    id: 3,
    name: "Charlie Bernard",
    role: "Designer",
    avatar: "C",
    tasksCount: 4,
    completedTasks: 3,
  },
]

export function ProjectTeam({ projectId }: ProjectTeamProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Équipe</CardTitle>
            <CardDescription>Membres assignés au projet</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{member.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{member.name}</p>
                <Badge variant="secondary">{member.role}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {member.completedTasks}/{member.tasksCount} tâches terminées
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
