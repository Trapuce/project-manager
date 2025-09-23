import { TaskDetailHeader } from "@/components/tasks/task-detail-header"
import { TaskDetailContent } from "@/components/tasks/task-detail-content"
import { TaskComments } from "@/components/tasks/task-comments"
import { TaskActivity } from "@/components/tasks/task-activity"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-6 p-6">
      <TaskDetailHeader taskId={params.id} />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <TaskDetailContent taskId={params.id} />
        </div>
        <div className="space-y-6">
          <TaskComments taskId={params.id} />
          <TaskActivity taskId={params.id} />
        </div>
      </div>
    </div>
  )
}
