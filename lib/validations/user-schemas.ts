import { z } from 'zod';

// Schéma pour la mise à jour du profil utilisateur
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(val), {
      message: 'Format de numéro de téléphone invalide',
    }),
  department: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Le département ne peut pas dépasser 100 caractères',
    }),
});

// Schéma pour la création d'utilisateur (admin)
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères'),
  role: z
    .enum(['ADMIN', 'MANAGER', 'MEMBER'], {
      errorMap: () => ({ message: 'Rôle invalide' }),
    }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(val), {
      message: 'Format de numéro de téléphone invalide',
    }),
  department: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Le département ne peut pas dépasser 100 caractères',
    }),
});

// Schéma pour la mise à jour d'utilisateur (admin)
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  role: z
    .enum(['ADMIN', 'MANAGER', 'MEMBER'], {
      errorMap: () => ({ message: 'Rôle invalide' }),
    }),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'PENDING'], {
      errorMap: () => ({ message: 'Statut invalide' }),
    }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(val), {
      message: 'Format de numéro de téléphone invalide',
    }),
  department: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Le département ne peut pas dépasser 100 caractères',
    }),
});

// Types TypeScript dérivés des schémas
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
