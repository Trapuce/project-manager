"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { jour: "Lun", creees: 12, terminees: 8, enRetard: 2 },
  { jour: "Mar", creees: 15, terminees: 12, enRetard: 1 },
  { jour: "Mer", creees: 8, terminees: 14, enRetard: 3 },
  { jour: "Jeu", creees: 18, terminees: 16, enRetard: 2 },
  { jour: "Ven", creees: 22, terminees: 20, enRetard: 1 },
  { jour: "Sam", creees: 5, terminees: 8, enRetard: 0 },
  { jour: "Dim", creees: 3, terminees: 5, enRetard: 1 },
]

const chartConfig = {
  creees: {
    label: "Créées",
    color: "hsl(var(--chart-1))",
  },
  terminees: {
    label: "Terminées",
    color: "hsl(var(--chart-2))",
  },
  enRetard: {
    label: "En retard",
    color: "hsl(var(--chart-3))",
  },
}

export function TaskAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flux des tâches</CardTitle>
        <CardDescription>Activité quotidienne de la semaine</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="jour" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="creees"
                stackId="1"
                stroke="var(--color-creees)"
                fill="var(--color-creees)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="terminees"
                stackId="1"
                stroke="var(--color-terminees)"
                fill="var(--color-terminees)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="enRetard"
                stackId="1"
                stroke="var(--color-enRetard)"
                fill="var(--color-enRetard)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
