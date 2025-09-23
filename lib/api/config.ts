import { APP_CONFIG } from '../config'

// Configuration de l'API backend
export const API_CONFIG = {
  BASE_URL: APP_CONFIG.API_URL,
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
    },
    USERS: {
      BASE: '/api/users',
      PROFILE: '/api/users/profile',
      SEARCH: '/api/users/search',
      STATUS: '/api/users/status',
      ROLE: '/api/users/role',
      DEPARTMENT: '/api/users/department',
      PROJECT: '/api/users/project',
      STATS: '/api/users/stats',
    },
    PROJECTS: {
      BASE: '/api/projects',
      MY_PROJECTS: '/api/projects/my-projects',
      SEARCH: '/api/projects/search',
      STATUS: '/api/projects/status',
      PRIORITY: '/api/projects/priority',
      DUE_DATE: '/api/projects/due-date',
      OVERDUE: '/api/projects/overdue',
      STATS: '/api/projects/stats',
    },
    TASKS: {
      BASE: '/api/tasks',
      MY_TASKS: '/api/tasks/my-tasks',
      PROJECT: '/api/tasks/project',
      SEARCH: '/api/tasks/search',
      STATUS: '/api/tasks/status',
      PRIORITY: '/api/tasks/priority',
      DUE_DATE: '/api/tasks/due-date',
      OVERDUE: '/api/tasks/overdue',
      ROOT: '/api/tasks/root',
      SUBTASKS: '/api/tasks/subtasks',
      STATS: '/api/tasks/stats',
    },
    FILES: {
      UPLOAD: '/api/files/upload',
      DOWNLOAD: '/api/files/download',
      PROJECT: '/api/files/project',
      TASK: '/api/files/task',
      SEARCH: '/api/files/search',
      CONTENT_TYPE: '/api/files/content-type',
      SIZE: '/api/files/size',
    },
  },
  MAX_FILE_SIZE: APP_CONFIG.MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
} as const;

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Types pour l'authentification
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  role?: 'ADMIN' | 'MANAGER' | 'MEMBER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Types pour les utilisateurs
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
}

export interface ChangePasswordRequest {
  password: string;
}

// Types pour les projets
export interface Project {
  id: number;
  name: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  members: User[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  startDate?: string;
  dueDate?: string;
  memberIds?: number[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  startDate?: string;
  dueDate?: string;
}

// Types pour les tâches
export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: string;
  updatedAt: string;
  project: Project;
  assignee?: User;
  createdBy: User;
  parentTask?: Task;
  subtasks?: Task[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  estimatedHours?: number;
  assigneeId?: number;
  parentTaskId?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

// Types pour les fichiers
export interface File {
  id: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  filePath: string;
  uploadedAt: string;
  uploadedBy: User;
  project?: Project;
  task?: Task;
}

export interface FileUploadRequest {
  file: File;
  projectId?: number;
  taskId?: number;
}

// Types pour les statistiques (structure réelle du backend)
export interface UserStats {
  active: number;
  inactive: number;
  pending: number;
}

export interface ProjectStats {
  todo: number;
  in_progress: number;
  on_hold: number;
  completed: number;
  archived: number;
}

export interface TaskStats {
  todo: number;
  in_progress: number;
  on_hold: number;
  completed: number;
}

// Types pour les filtres et recherche
export interface SearchParams {
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}
