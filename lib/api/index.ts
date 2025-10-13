// Export de tous les services API
export { apiClient } from './client';
export { authService } from './auth';
export { usersService } from './users';
export { projectsService } from './projects';
export { tasksService } from './tasks';
export { filesService } from './files';

// Export de la configuration et des types
export { API_CONFIG } from './config';
export type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserStats,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectStats,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStats,
  FileAttachment,
  Comment,
  FileUploadRequest,
  SearchParams,
  DateRangeParams,
} from './config';
