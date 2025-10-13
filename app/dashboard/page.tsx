import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ProjectsChart } from "@/components/dashboard/projects-chart"
import { TasksChart } from "@/components/dashboard/tasks-chart"
import { TeamPerformance } from "@/components/dashboard/team-performance"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"
import { SectionTransition, FadeInTransition, StaggeredTransition } from "@/components/ui/section-transition"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <FadeInTransition>
        <DashboardStats />
      </FadeInTransition>

      <SectionTransition delay={0.1}>
        <div className="grid gap-6 md:grid-cols-2">
          <ProjectsChart />
          <TasksChart />
        </div>
      </SectionTransition>

      <SectionTransition delay={0.2}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentProjects />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
      </SectionTransition>

      <SectionTransition delay={0.3}>
        <div className="grid gap-6 md:grid-cols-2">
          <TeamPerformance />
          <UpcomingDeadlines />
        </div>
      </SectionTransition>

      <SectionTransition delay={0.4}>
        <RecentTasks />
      </SectionTransition>
    </div>
  )
}
