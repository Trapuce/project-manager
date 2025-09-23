"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { membre: "Alice", taches: 28, heures: 142, efficacite: 86 },
  { membre: "Bob", taches: 35, heures: 168, efficacite: 89 },
  { membre: "Charlie", taches: 22, heures: 98, efficacite: 82 },
  { membre: "David", taches: 20, heures: 115, efficacite: 75 },
  { membre: "Eve", taches: 18, heures: 89, efficacite: 78 },
]

const chartConfig = {
  taches: {
    label: "Tâches terminées",
    color: "hsl(var(--chart-1))",
  },
  heures: {
    label: "Heures travaillées",
    color: "hsl(var(--chart-2))",
  },
}

export function TeamAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance individuelle</CardTitle>
        <CardDescription>Tâches et heures par membre</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="membre" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="taches" fill="var(--color-taches)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
