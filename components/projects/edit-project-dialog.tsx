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
import { projectsService } from "@/lib/api"
import { useProjectsStore } from "@/stores/projects-store"
import { z } from "zod"
import type { Project } from "@/lib/api"

// Schema de validation pour la modification
const editProjectSchema = z.object({
  name: z.string().min(1, 'Le nom du projet est requis.'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'La priorité du projet est requise.',
    invalid_type_error: 'Priorité invalide.'
  }),
  status: z.enum(['TODO', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'ARCHIVED'], {
    required_error: 'Le statut du projet est requis.',
    invalid_type_error: 'Statut invalide.'
  }),
  startDate: z.string().refine((dateString) => {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }, 'Date de début invalide.'),
  dueDate: z.string().refine((dateString) => {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  }, 'Date d\'échéance invalide.')
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const dueDate = new Date(data.dueDate)
  return dueDate > startDate
}, {
  message: 'La date d\'échéance doit être postérieure à la date de début.',
  path: ['dueDate']
})

type EditProjectFormData = z.infer<typeof editProjectSchema>

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
}

export function EditProjectDialog({ open, onOpenChange, project }: EditProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { loadProjects } = useProjectsStore()

  const form = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      startDate: "",
      dueDate: ""
    }
  })

  // Mettre à jour le formulaire quand le projet change
  useEffect(() => {
    if (project && open) {
      form.reset({
        name: project.name,
        description: project.description || "",
        priority: project.priority,
        status: project.status,
        startDate: project.startDate.split('T')[0], // Convertir en format date local
        dueDate: project.dueDate.split('T')[0]
      })
    }
  }, [project, open, form])

  const handleDialogClose = (open: boolean) => {
    if (!open && !isLoading) {
      form.reset()
    }
    onOpenChange(open)
  }

  const onSubmit = async (data: EditProjectFormData) => {
    if (!project) return

    setIsLoading(true)
    try {
      await projectsService.updateProject(project.id, data)
      
      actionToast.project.updateSuccess(data.name)
      
      handleDialogClose(false)
      loadProjects()
      
    } catch (error) {
      console.error('Erreur lors de la modification du projet:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la modification du projet'
      
      actionToast.updateError('Projet', {
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
          <DialogTitle>Modifier le projet</DialogTitle>
          <DialogDescription>
            Modifiez les détails du projet ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nom du projet */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du projet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du projet" {...field} />
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
                      placeholder="Décrivez les objectifs et le contexte du projet..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priorité et Statut */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TODO">À faire</SelectItem>
                        <SelectItem value="PLANNING">Planification</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="COMPLETED">Terminé</SelectItem>
                        <SelectItem value="ON_HOLD">En pause</SelectItem>
                        <SelectItem value="ARCHIVED">Archivé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dates */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                {isLoading ? "Modification..." : "Modifier le projet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
