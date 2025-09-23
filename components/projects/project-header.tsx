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
import { ArrowLeft, MoreHorizontal, Edit, Archive, Trash2, Share, Settings, Files } from "lucide-react"
import Link from "next/link"

interface ProjectHeaderProps {
  projectId: string
}

// Mock data - in real app, this would come from API
const projectData = {
  name: "Site E-commerce",
  description: "Développement d'une plateforme de vente en ligne moderne avec paiement intégré",
  status: "En cours",
  priority: "Haute",
  team: [
    { name: "Alice", avatar: "A" },
    { name: "Bob", avatar: "B" },
    { name: "Charlie", avatar: "C" },
  ],
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux projets
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{projectData.name}</h1>
          <p className="text-muted-foreground max-w-2xl">{projectData.description}</p>
          <div className="flex items-center space-x-2">
            <Badge variant="default">{projectData.status}</Badge>
            <Badge variant="destructive">{projectData.priority}</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Équipe:</span>
            <div className="flex -space-x-2">
              {projectData.team.map((member, index) => (
                <Avatar key={index} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          <Link href={`/dashboard/projects/${projectId}/files`}>
            <Button variant="outline">
              <Files className="mr-2 h-4 w-4" />
              Fichiers
            </Button>
          </Link>

          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Partager
          </Button>

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
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
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
