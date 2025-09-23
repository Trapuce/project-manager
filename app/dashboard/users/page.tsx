import { UsersHeader } from "@/components/users/users-header"
import { UsersTable } from "@/components/users/users-table"
import { UsersStats } from "@/components/users/users-stats"

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <UsersHeader />
      <UsersStats />
      <UsersTable />
    </div>
  )
}
