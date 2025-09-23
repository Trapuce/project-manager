import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectOverview } from "@/components/projects/project-overview"
import { ProjectTasks } from "@/components/projects/project-tasks"
import { ProjectTeam } from "@/components/projects/project-team"
import { ProjectActivity } from "@/components/projects/project-activity"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-6 p-6">
      <ProjectHeader projectId={params.id} />
      <ProjectOverview projectId={params.id} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <ProjectTasks projectId={params.id} />
        </div>
        <div className="space-y-6">
          <ProjectTeam projectId={params.id} />
          <ProjectActivity projectId={params.id} />
        </div>
      </div>
    </div>
  )
}
