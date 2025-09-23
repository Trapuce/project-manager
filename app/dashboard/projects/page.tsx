import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsStats } from "@/components/projects/projects-stats"
import { ProjectsGrid } from "@/components/projects/projects-grid"

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <ProjectsHeader />
      <ProjectsStats />
      <ProjectsGrid />
    </div>
  )
}
