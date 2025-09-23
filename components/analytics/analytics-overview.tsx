import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const metrics = [
  {
    title: "Projets terminés",
    value: "23",
    change: "+15%",
    trend: "up",
    description: "vs mois dernier",
  },
  {
    title: "Taux de completion",
    value: "87%",
    change: "+3%",
    trend: "up",
    description: "des tâches",
  },
  {
    title: "Temps moyen par tâche",
    value: "4.2h",
    change: "-12%",
    trend: "down",
    description: "amélioration",
  },
  {
    title: "Satisfaction équipe",
    value: "4.6/5",
    change: "0%",
    trend: "stable",
    description: "score moyen",
  },
]

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

const trendColors = {
  up: "text-green-600",
  down: "text-red-600",
  stable: "text-gray-600",
}

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = trendIcons[metric.trend as keyof typeof trendIcons]
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <TrendIcon className={`h-4 w-4 ${trendColors[metric.trend as keyof typeof trendColors]}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className={trendColors[metric.trend as keyof typeof trendColors]}>{metric.change}</span>
                <span className="text-muted-foreground">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
