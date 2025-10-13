"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Edit, Trash2, User, AlertCircle, Loader2 } from "lucide-react"
import { useUsersStore } from "@/stores/users-store"
import { actionToast } from "@/components/ui/action-toast"
import type { User } from "@/lib/api"

interface UsersTableProps {
  searchQuery: string
  roleFilter: string
  statusFilter: string
}

const roleColors = {
  ADMIN: "destructive",
  MANAGER: "default",
  MEMBER: "secondary",
} as const

const statusColors = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  PENDING: "outline",
} as const

export function UsersTable({ searchQuery, roleFilter, statusFilter }: UsersTableProps) {
  const { users, isLoading, error, loadUsers } = useUsersStore()

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchQuery || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      ADMIN: 'Administrateur',
      MANAGER: 'Manager',
      MEMBER: 'Membre'
    }
    return labels[role as keyof typeof labels] || role
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      ACTIVE: 'Actif',
      INACTIVE: 'Inactif',
      PENDING: 'En attente'
    }
    return labels[status as keyof typeof labels] || status
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Chargement des utilisateurs...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">{error}</p>
              <button
                onClick={loadUsers}
                className="text-sm text-primary hover:underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filteredUsers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {searchQuery || roleFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'Aucun utilisateur ne correspond aux filtres'
                  : 'Aucun utilisateur trouvé'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      {user.department && (
                        <div className="text-sm text-muted-foreground">{user.department}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={roleColors[user.role as keyof typeof roleColors]}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[user.status as keyof typeof statusColors]}>
                    {getStatusLabel(user.status)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Voir le profil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer un email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
