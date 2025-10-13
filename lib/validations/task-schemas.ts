import { z } from 'zod';

// Schéma pour la création de tâche
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, {
      message: 'La description ne peut pas dépasser 1000 caractères',
    }),
  projectId: z
    .number()
    .min(1, 'Le projet est requis'),
  assignedToId: z
    .number()
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Priorité invalide' }),
    }),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'], {
      errorMap: () => ({ message: 'Statut invalide' }),
    }),
  dueDate: z
    .date()
    .optional(),
});

// Schéma pour la mise à jour de tâche
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, {
      message: 'La description ne peut pas dépasser 1000 caractères',
    }),
  projectId: z
    .number()
    .min(1, 'Le projet est requis'),
  assignedToId: z
    .number()
    .optional(),
  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'], {
      errorMap: () => ({ message: 'Priorité invalide' }),
    }),
  status: z
    .enum(['TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'], {
      errorMap: () => ({ message: 'Statut invalide' }),
    }),
  dueDate: z
    .date()
    .optional(),
});

// Schéma pour les filtres de tâche
export const taskFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ALL_STATUSES', 'TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED']).optional(),
  priority: z.enum(['ALL_PRIORITIES', 'LOW', 'MEDIUM', 'HIGH']).optional(),
  projectId: z.enum(['ALL_PROJECTS']).or(z.string().transform(Number)).optional(),
  assignedToId: z.enum(['ALL_USERS']).or(z.string().transform(Number)).optional(),
  page: z.number().min(1).optional(),
  size: z.number().min(1).max(100).optional(),
});

// Types TypeScript dérivés des schémas
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type TaskFiltersFormData = z.infer<typeof taskFiltersSchema>;
