"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RotateCcw } from "lucide-react"

interface UsersHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  roleFilter: string
  onRoleFilterChange: (role: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  onClearFilters: () => void
}

export function UsersHeader({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}: UsersHeaderProps) {
  const hasActiveFilters = searchQuery.trim() !== '' || roleFilter !== 'ALL' || statusFilter !== 'ALL'

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Gérez les membres de votre équipe et leurs rôles</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Rechercher un utilisateur..." 
            className="pl-10 w-64"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={roleFilter} onValueChange={onRoleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
            <SelectItem value="MANAGER">Manager</SelectItem>
            <SelectItem value="MEMBER">Membre</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actif</SelectItem>
            <SelectItem value="INACTIVE">Inactif</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>
    </div>
  )
}
