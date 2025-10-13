"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { actionToast } from "@/components/ui/action-toast"
import { tasksService, projectsService, usersService } from "@/lib/api"
import { z } from "zod"
import type { Project, User } from "@/lib/api"

// Schema de validation pour la création de tâche
const createTaskSchema = z.object({
  title: z.string().min(1, 'Le titre de la tâche est requis.'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'La priorité de la tâche est requise.',
    invalid_type_error: 'Priorité invalide.'
  }),
  dueDate: z.string().refine((dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, 'La date d\'échéance ne peut pas être dans le passé.'),
  projectId: z.number({
    required_error: 'Le projet est requis.',
    invalid_type_error: 'Projet invalide.'
  }),
  assignedToId: z.number().optional()
})

type CreateTaskFormData = z.infer<typeof createTaskSchema>

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated?: () => void
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }: CreateTaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
      projectId: undefined,
      assignedToId: undefined
    }
  })

  // Charger les projets et utilisateurs
  useEffect(() => {
    if (open) {
      loadProjectsAndUsers()
    }
  }, [open])

  const loadProjectsAndUsers = async () => {
    try {
      const [projectsData, usersData] = await Promise.all([
        projectsService.getAllProjects({ page: 0, size: 100 }),
        usersService.getAllUsers({ page: 0, size: 100 })
      ])
      setProjects(projectsData.content || [])
      setUsers(usersData.content || [])
    } catch (error) {
      actionToast.error("Erreur lors du chargement des données", {
        description: "Impossible de charger les projets et utilisateurs"
      })
    }
  }

  const handleDialogClose = (open: boolean) => {
    if (!open && !isLoading) {
      form.reset()
    }
    onOpenChange(open)
  }

  const onSubmit = async (data: CreateTaskFormData) => {
    setIsLoading(true)
    
    try {
      const taskData = {
        ...data,
        assignedToId: data.assignedToId === 'unassigned' ? undefined : Number(data.assignedToId)
      }
      const newTask = await tasksService.createTask(taskData)
      
      actionToast.task.createSuccess(data.title)
      
      form.reset()
      handleDialogClose(false)
      onTaskCreated?.()
      
    } catch (error) {
      const errorMessage = 'Erreur lors de la création de la tâche'
      
      actionToast.createError('Tâche', {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
          <DialogDescription>
            Remplissez les détails ci-dessous pour créer une nouvelle tâche.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Titre de la tâche */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la tâche *</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la tâche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les détails de la tâche..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Projet et Priorité */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projet *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un projet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Basse</SelectItem>
                        <SelectItem value="MEDIUM">Moyenne</SelectItem>
                        <SelectItem value="HIGH">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Assignation et Date d'échéance */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigner à</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un utilisateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">Non assigné</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.firstName} {user.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'échéance *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleDialogClose(false)} 
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer la tâche"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
