import { APP_CONFIG } from '../config'

// Configuration de l'API backend
export const API_CONFIG = {
  BASE_URL: APP_CONFIG.API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
      CHANGE_PASSWORD: '/api/auth/change-password',
    },
    USERS: {
      BASE: '/api/users',
      PROFILE: '/api/users/profile',
      BY_ID: (id: number) => `/api/users/${id}`,
      SEARCH: '/api/users/search',
      STATS: '/api/users/stats',
      CHANGE_PASSWORD: '/api/users/change-password',
    },
    PROJECTS: {
      BASE: '/api/projects',
      BY_ID: (id: number) => `/api/projects/${id}`,
      MY_PROJECTS: '/api/projects/my-projects',
      SEARCH: '/api/projects/search',
      STATS: '/api/projects/stats',
    },
    TASKS: {
      BASE: '/api/tasks',
      BY_ID: (id: number) => `/api/tasks/${id}`,
      MY_TASKS: '/api/tasks/my-tasks',
      BY_PROJECT: (projectId: number) => `/api/tasks/project/${projectId}`,
      SEARCH: '/api/tasks/search',
      STATS: '/api/tasks/stats',
    },
    FILES: {
      UPLOAD: '/api/files/upload',
      BY_PROJECT: (projectId: number) => `/api/files/project/${projectId}`,
      BY_TASK: (taskId: number) => `/api/files/task/${taskId}`,
      SEARCH: '/api/files/search',
      DOWNLOAD: (fileId: number) => `/api/files/download/${fileId}`,
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
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  avatar?: string;
  phone?: string;
  department?: string;
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
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  startDate?: string;
  dueDate?: string;
  owner: User;
  members: User[];
  tasks: Task[];
  files: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate?: string;
  dueDate?: string;
  memberIds?: number[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate?: string;
  dueDate?: string;
}

// Types pour les tâches
export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  project: Project;
  assignee?: User;
  creator: User;
  parentTask?: Task;
  subtasks: Task[];
  comments: Comment[];
  files: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  projectId: number;
  assigneeId?: number;
  parentTaskId?: number;
  estimatedHours?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

// Types pour les fichiers
export interface FileAttachment {
  id: number;
  fileName: string;
  originalFileName: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  project?: Project;
  task?: Task;
  uploadedBy: User;
  uploadedAt: string;
}

// Types pour les commentaires
export interface Comment {
  id: number;
  content: string;
  author: User;
  task: Task;
  createdAt: string;
  updatedAt: string;
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
  completed: number;
  planning: number;
}

export interface TaskStats {
  todo: number;
  in_progress: number;
  completed: number;
  pending: number;
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
