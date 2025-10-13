"use client"

import { useEffect } from "react"
import { UsersHeader } from "@/components/users/users-header"
import { UsersTable } from "@/components/users/users-table"
import { UsersStats } from "@/components/users/users-stats"
import { useUsersStore } from "@/stores/users-store"
import { SectionTransition, FadeInTransition } from "@/components/ui/section-transition"

export default function UsersPage() {
  const {
    searchQuery,
    roleFilter,
    statusFilter,
    setSearchQuery,
    setRoleFilter,
    setStatusFilter,
    clearFilters,
    loadUsers,
    loadStats,
  } = useUsersStore()

  // Charger les données au montage
  useEffect(() => {
    loadUsers()
    loadStats()
  }, [loadUsers, loadStats])

  return (
    <div className="flex-1 space-y-6 p-6">
      <FadeInTransition>
        <UsersHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={clearFilters}
        />
      </FadeInTransition>
      
      <SectionTransition delay={0.1}>
        <UsersStats />
      </SectionTransition>
      
      <SectionTransition delay={0.2}>
        <UsersTable 
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
        />
      </SectionTransition>
    </div>
  )
}