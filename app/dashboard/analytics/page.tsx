import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { ProjectAnalytics } from "@/components/analytics/project-analytics"
import { TaskAnalytics } from "@/components/analytics/task-analytics"
import { TeamAnalytics } from "@/components/analytics/team-analytics"
import { TimeTracking } from "@/components/analytics/time-tracking"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <AnalyticsHeader />
      <AnalyticsOverview />

      <div className="grid gap-6 md:grid-cols-2">
        <ProjectAnalytics />
        <TaskAnalytics />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TeamAnalytics />
        <TimeTracking />
      </div>
    </div>
  )
}
