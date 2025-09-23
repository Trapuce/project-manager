"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "En cours", value: 12, color: "hsl(var(--chart-1))" },
  { name: "Terminés", value: 8, color: "hsl(var(--chart-2))" },
  { name: "En pause", value: 3, color: "hsl(var(--chart-3))" },
  { name: "Archivés", value: 15, color: "hsl(var(--chart-4))" },
]

const chartConfig = {
  "En cours": {
    label: "En cours",
    color: "hsl(var(--chart-1))",
  },
  Terminés: {
    label: "Terminés",
    color: "hsl(var(--chart-2))",
  },
  "En pause": {
    label: "En pause",
    color: "hsl(var(--chart-3))",
  },
  Archivés: {
    label: "Archivés",
    color: "hsl(var(--chart-4))",
  },
}

export function ProjectAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des projets</CardTitle>
        <CardDescription>Distribution par statut</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
