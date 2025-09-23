"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", actifs: 8, termines: 12, archives: 3 },
  { month: "Fév", actifs: 10, termines: 8, archives: 5 },
  { month: "Mar", actifs: 12, termines: 15, archives: 2 },
  { month: "Avr", actifs: 9, termines: 18, archives: 4 },
  { month: "Mai", actifs: 14, termines: 11, archives: 6 },
  { month: "Jun", actifs: 12, termines: 16, archives: 3 },
]

const chartConfig = {
  actifs: {
    label: "Projets actifs",
    color: "hsl(var(--chart-1))",
  },
  termines: {
    label: "Projets terminés",
    color: "hsl(var(--chart-2))",
  },
  archives: {
    label: "Projets archivés",
    color: "hsl(var(--chart-3))",
  },
}

export function ProjectsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution des projets</CardTitle>
        <CardDescription>Suivi mensuel des projets par statut</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="actifs" fill="var(--color-actifs)" radius={4} />
              <Bar dataKey="termines" fill="var(--color-termines)" radius={4} />
              <Bar dataKey="archives" fill="var(--color-archives)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
