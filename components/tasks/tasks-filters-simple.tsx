"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X, RotateCcw } from "lucide-react"

export interface TaskFilters {
  search: string
  status: string
  priority: string
  project: string
}

interface TasksFiltersProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

export function TasksFilters({ filters, onFiltersChange }: TasksFiltersProps) {
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters)

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = { search: '', status: 'ALL_STATUSES', priority: 'ALL_PRIORITIES', project: 'ALL_PROJECTS' }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = 
    localFilters.search.trim() !== '' || 
    localFilters.status !== 'ALL_STATUSES' || 
    localFilters.priority !== 'ALL_PRIORITIES' ||
    localFilters.project !== 'ALL_PROJECTS'

  const statusOptions = [
    { value: 'ALL_STATUSES', label: 'Tous les statuts' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'COMPLETED', label: 'Terminé' },
    { value: 'CANCELLED', label: 'Annulé' }
  ]

  const priorityOptions = [
    { value: 'ALL_PRIORITIES', label: 'Toutes les priorités' },
    { value: 'LOW', label: 'Basse' },
    { value: 'MEDIUM', label: 'Moyenne' },
    { value: 'HIGH', label: 'Haute' }
  ]

  const projectOptions = [
    { value: 'ALL_PROJECTS', label: 'Tous les projets' },
    // Les projets seront chargés dynamiquement
  ]

  const getFilterLabel = (key: keyof TaskFilters, value: string) => {
    switch (key) {
      case 'status':
        return statusOptions.find(option => option.value === value)?.label || value
      case 'priority':
        return priorityOptions.find(option => option.value === value)?.label || value
      case 'project':
        return projectOptions.find(option => option.value === value)?.label || value
      default:
        return value
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par titre ou description..."
                className="pl-10"
                value={localFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={localFilters.priority}
              onValueChange={(value) => handleFilterChange('priority', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Project Filter */}
            <Select
              value={localFilters.project}
              onValueChange={(value) => handleFilterChange('project', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Projet" />
              </SelectTrigger>
              <SelectContent>
                {projectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Effacer
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Filtres actifs:</span>
              
              {localFilters.search.trim() !== '' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Recherche: "{localFilters.search}"
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleFilterChange('search', '')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {localFilters.status !== 'ALL' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Statut: {getFilterLabel('status', localFilters.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleFilterChange('status', 'ALL')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {localFilters.priority !== 'ALL' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Priorité: {getFilterLabel('priority', localFilters.priority)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleFilterChange('priority', 'ALL')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}

              {localFilters.project !== 'ALL' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Projet: {getFilterLabel('project', localFilters.project)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleFilterChange('project', 'ALL')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
