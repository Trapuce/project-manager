"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { semaine: "S1", creees: 24, terminees: 18, enCours: 12 },
  { semaine: "S2", creees: 32, terminees: 28, enCours: 16 },
  { semaine: "S3", creees: 28, terminees: 22, enCours: 20 },
  { semaine: "S4", creees: 35, terminees: 31, enCours: 24 },
  { semaine: "S5", creees: 29, terminees: 26, enCours: 27 },
  { semaine: "S6", creees: 38, terminees: 34, enCours: 31 },
]

const chartConfig = {
  creees: {
    label: "Tâches créées",
    color: "hsl(var(--chart-1))",
  },
  terminees: {
    label: "Tâches terminées",
    color: "hsl(var(--chart-2))",
  },
  enCours: {
    label: "Tâches en cours",
    color: "hsl(var(--chart-3))",
  },
}

export function TasksChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivité des tâches</CardTitle>
        <CardDescription>Évolution hebdomadaire des tâches</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="semaine" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="creees"
                stroke="var(--color-creees)"
                strokeWidth={2}
                dot={{ fill: "var(--color-creees)" }}
              />
              <Line
                type="monotone"
                dataKey="terminees"
                stroke="var(--color-terminees)"
                strokeWidth={2}
                dot={{ fill: "var(--color-terminees)" }}
              />
              <Line
                type="monotone"
                dataKey="enCours"
                stroke="var(--color-enCours)"
                strokeWidth={2}
                dot={{ fill: "var(--color-enCours)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
