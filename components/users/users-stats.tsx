import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Crown } from "lucide-react"

const stats = [
  {
    title: "Total utilisateurs",
    value: "24",
    description: "+3 ce mois",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Utilisateurs actifs",
    value: "18",
    description: "Connectés cette semaine",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Invitations en attente",
    value: "6",
    description: "À confirmer",
    icon: UserX,
    color: "text-orange-600",
  },
  {
    title: "Administrateurs",
    value: "3",
    description: "Accès complet",
    icon: Crown,
    color: "text-purple-600",
  },
]

export function UsersStats() {
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
