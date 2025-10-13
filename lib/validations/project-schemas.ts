import { z } from 'zod'

// Schéma pour la création d'un projet
export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du projet est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Veuillez sélectionner une priorité valide' })
    }),
  
  startDate: z
    .string()
    .min(1, 'La date de début est requise')
    .refine((date) => {
      const startDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return startDate >= today
    }, 'La date de début ne peut pas être dans le passé'),
  
  dueDate: z
    .string()
    .min(1, 'La date d\'échéance est requise')
    .refine((date) => {
      const dueDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return dueDate >= today
    }, 'La date d\'échéance ne peut pas être dans le passé')
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const dueDate = new Date(data.dueDate)
  return dueDate > startDate
}, {
  message: 'La date d\'échéance doit être postérieure à la date de début',
  path: ['dueDate']
}).refine((data) => {
  const dueDate = new Date(data.dueDate)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 2)
  return dueDate <= maxDate
}, {
  message: 'La date d\'échéance ne peut pas dépasser 2 ans dans le futur',
  path: ['dueDate']
})

// Schéma pour la mise à jour d'un projet
export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du projet est requis')
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim()
    .optional(),
  
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Veuillez sélectionner une priorité valide' })
    })
    .optional(),
  
  status: z
    .enum(['TODO', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'ARCHIVED'], {
      errorMap: () => ({ message: 'Veuillez sélectionner un statut valide' })
    })
    .optional(),
  
  startDate: z
    .string()
    .optional(),
  
  dueDate: z
    .string()
    .optional()
}).refine((data) => {
  if (data.startDate && data.dueDate) {
    const startDate = new Date(data.startDate)
    const dueDate = new Date(data.dueDate)
    return dueDate > startDate
  }
  return true
}, {
  message: 'La date d\'échéance doit être postérieure à la date de début',
  path: ['dueDate']
})

// Schéma pour les filtres de projets
export const projectFiltersSchema = z.object({
  status: z
    .enum(['ALL', 'TODO', 'PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'ARCHIVED'])
    .optional(),
  
  priority: z
    .enum(['ALL', 'LOW', 'MEDIUM', 'HIGH'])
    .optional(),
  
  owner: z
    .string()
    .optional(),
  
  search: z
    .string()
    .max(100, 'La recherche ne peut pas dépasser 100 caractères')
    .optional()
})

// Types TypeScript dérivés des schémas
export type CreateProjectFormData = z.infer<typeof createProjectSchema>
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>
export type ProjectFiltersFormData = z.infer<typeof projectFiltersSchema>
