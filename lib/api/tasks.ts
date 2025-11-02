import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  Task,
  TaskStats,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from './config';

export class TasksService {
  // Obtenir toutes les tâches (Admin seulement)
  async getAllTasks(params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      params
    );
    return response.data;
  }

  // Obtenir une tâche par ID
  async getTaskById(id: number): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BY_ID(id)
    );
    return response.data;
  }

  // Obtenir mes tâches (pour les membres)
  async getMyTasks(params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.MY_TASKS,
      params
    );
    return response.data;
  }

  // Obtenir les tâches d'un projet
  async getTasksByProject(projectId: number, params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BY_PROJECT(projectId),
      params
    );
    return response.data;
  }

  // Créer une nouvelle tâche
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.post(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      taskData
    );
    return response.data;
  }

  // Mettre à jour une tâche
  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.put(
      API_CONFIG.ENDPOINTS.TASKS.BY_ID(id),
      taskData
    );
    return response.data;
  }

  // Supprimer une tâche
  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.TASKS.BY_ID(id));
  }

  // Rechercher des tâches
  async searchTasks(query: string, params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const searchParams = { ...params, query };
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Obtenir les statistiques des tâches
  async getTaskStats(): Promise<TaskStats> {
    const response: ApiResponse<TaskStats> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.STATS
    );
    return response.data;
  }

  // Changer le statut d'une tâche
  async updateTaskStatus(taskId: number, status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED'): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.TASKS.BY_ID(taskId)}/status?status=${status}`,
      {}
    );
    return response.data;
  }


  // Obtenir les tâches par statut
  async getTasksByStatus(status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED'): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      { status }
    );
    return response.data;
  }

  // Obtenir les tâches par priorité
  async getTasksByPriority(priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      { priority }
    );
    return response.data;
  }

  // Obtenir les tâches en retard
  async getOverdueTasks(): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      { overdue: true }
    );
    return response.data;
  }

  // Obtenir les tâches assignées à un utilisateur
  async getTasksByAssignee(userId: number): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      { assigneeId: userId }
    );
    return response.data;
  }

  // Obtenir les tâches créées par un utilisateur
  async getTasksByCreator(userId: number): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      { createdBy: userId }
    );
    return response.data;
  }

  // Obtenir les sous-tâches d'une tâche
  async getSubtasks(parentTaskId: number): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      { parentTaskId }
    );
    return response.data;
  }

  // Créer une sous-tâche
  async createSubtask(parentTaskId: number, taskData: Omit<CreateTaskRequest, 'parentTaskId'>): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.post(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      { ...taskData, parentTaskId }
    );
    return response.data;
  }

  // Mettre à jour le temps passé sur une tâche
  async updateTaskHours(taskId: number, actualHours: number): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.TASKS.BY_ID(taskId)}/hours`,
      { actualHours }
    );
    return response.data;
  }
}

// Instance singleton du service des tâches
export const tasksService = new TasksService();