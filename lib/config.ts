// Configuration de l'application
export const APP_CONFIG = {
  // URL de l'API backend
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  
  // Configuration de l'authentification
  JWT_EXPIRY: parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRY || '86400000'),
  
  // Configuration des fichiers
  MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'), // 10MB
  
  // Mode debug (désactivé en production)
  DEBUG_MODE: false,
  
  // Configuration de la pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Configuration des notifications
  TOAST_DURATION: 5000,
  
  // Configuration des thèmes
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
  
  // Configuration des rôles
  ROLES: {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    MEMBER: 'MEMBER',
  },
  
  // Configuration des statuts de projet
  PROJECT_STATUS: {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    ON_HOLD: 'ON_HOLD',
    COMPLETED: 'COMPLETED',
    ARCHIVED: 'ARCHIVED',
  },
  
  // Configuration des statuts de tâche
  TASK_STATUS: {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    IN_REVIEW: 'IN_REVIEW',
    DONE: 'DONE',
    CANCELLED: 'CANCELLED',
  },
  
  // Configuration des priorités
  PRIORITIES: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
  },
  
  // Configuration des statuts utilisateur
  USER_STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
  },
} as const

// Types pour la configuration
export type AppConfig = typeof APP_CONFIG
export type Theme = typeof APP_CONFIG.THEMES[keyof typeof APP_CONFIG.THEMES]
export type Role = typeof APP_CONFIG.ROLES[keyof typeof APP_CONFIG.ROLES]
export type ProjectStatus = typeof APP_CONFIG.PROJECT_STATUS[keyof typeof APP_CONFIG.PROJECT_STATUS]
export type TaskStatus = typeof APP_CONFIG.TASK_STATUS[keyof typeof APP_CONFIG.TASK_STATUS]
export type Priority = typeof APP_CONFIG.PRIORITIES[keyof typeof APP_CONFIG.PRIORITIES]
export type UserStatus = typeof APP_CONFIG.USER_STATUS[keyof typeof APP_CONFIG.USER_STATUS]
