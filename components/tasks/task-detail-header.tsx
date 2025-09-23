"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreHorizontal, Edit, Copy, Archive, Trash2, Calendar, Clock } from "lucide-react"
import Link from "next/link"

interface TaskDetailHeaderProps {
  taskId: string
}

// Mock data - in real app, this would come from API
const taskData = {
  title: "Intégrer l'API de paiement Stripe",
  description: "Configurer et tester les paiements en ligne avec gestion des erreurs et webhooks",
  project: "Site E-commerce",
  status: "En cours",
  priority: "Haute",
  assignee: { name: "Alice Dupont", avatar: "A" },
  dueDate: "2023-12-20",
  createdDate: "2023-12-10",
}

export function TaskDetailHeader({ taskId }: TaskDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/tasks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux tâches
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{taskData.title}</h1>
            <p className="text-muted-foreground max-w-2xl">{taskData.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="default">{taskData.status}</Badge>
            <Badge variant="destructive">{taskData.priority}</Badge>
            <Badge variant="outline">{taskData.project}</Badge>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Échéance: {taskData.dueDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Créé le: {taskData.createdDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Assigné à:</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{taskData.assignee.avatar}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{taskData.assignee.name}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archiver
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
