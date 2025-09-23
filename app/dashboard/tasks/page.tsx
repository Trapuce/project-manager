import { TasksHeader } from "@/components/tasks/tasks-header"
import { TasksStats } from "@/components/tasks/tasks-stats"
import { TasksFilters } from "@/components/tasks/tasks-filters"
import { TasksList } from "@/components/tasks/tasks-list"

export default function TasksPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <TasksHeader />
      <TasksStats />
      <div className="grid gap-6 md:grid-cols-4">
        <div>
          <TasksFilters />
        </div>
        <div className="md:col-span-3">
          <TasksList />
        </div>
      </div>
    </div>
  )
}
