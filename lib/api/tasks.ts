import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskStats,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
  DateRangeParams,
} from './config';

export class TasksService {
  // Récupérer toutes les tâches (paginé)
  async getTasks(params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.BASE,
      params
    );
    return response.data;
  }

  // Récupérer les tâches de l'utilisateur connecté
  async getMyTasks(params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.MY_TASKS,
      params
    );
    return response.data;
  }

  // Récupérer une tâche par ID
  async getTaskById(id: number): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.TASKS.BASE}/${id}`
    );
    return response.data;
  }

  // Récupérer les tâches d'un projet
  async getTasksByProject(projectId: number, params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.TASKS.PROJECT}/${projectId}`,
      params
    );
    return response.data;
  }

  // Récupérer mes tâches dans un projet
  async getMyTasksByProject(projectId: number, params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.TASKS.PROJECT}/${projectId}/my-tasks`,
      params
    );
    return response.data;
  }

  // Rechercher des tâches
  async searchTasks(searchTerm: string, params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const searchParams = { search: searchTerm, ...params };
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Récupérer les tâches par statut
  async getTasksByStatus(status: 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED'): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.TASKS.STATUS}/${status}`
    );
    return response.data;
  }

  // Récupérer les tâches par priorité
  async getTasksByPriority(priority: 'LOW' | 'MEDIUM' | 'HIGH'): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.TASKS.PRIORITY}/${priority}`
    );
    return response.data;
  }

  // Récupérer les tâches par plage de dates
  async getTasksByDateRange(dateRange: DateRangeParams): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.DUE_DATE,
      dateRange
    );
    return response.data;
  }

  // Récupérer les tâches en retard
  async getOverdueTasks(): Promise<Task[]> {
    const response: ApiResponse<Task[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.OVERDUE
    );
    return response.data;
  }

  // Récupérer les tâches racines (sans parent)
  async getRootTasks(params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.ROOT,
      params
    );
    return response.data;
  }

  // Récupérer les sous-tâches
  async getSubtasks(parentTaskId: number, params?: SearchParams): Promise<PaginatedResponse<Task>> {
    const response: ApiResponse<PaginatedResponse<Task>> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.TASKS.SUBTASKS.replace('{parentTaskId}', parentTaskId.toString())}`,
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
      `${API_CONFIG.ENDPOINTS.TASKS.BASE}/${id}`,
      taskData
    );
    return response.data;
  }

  // Changer le statut d'une tâche
  async updateTaskStatus(id: number, status: 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED'): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.TASKS.BASE}/${id}/status?status=${status}`
    );
    return response.data;
  }

  // Assigner une tâche à un utilisateur
  async assignTask(taskId: number, userId: number): Promise<Task> {
    const response: ApiResponse<Task> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.TASKS.BASE}/${taskId}/assign/${userId}`
    );
    return response.data;
  }

  // Supprimer une tâche
  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.TASKS.BASE}/${id}`);
  }

  // Récupérer les statistiques des tâches
  async getTaskStats(): Promise<TaskStats> {
    const response: ApiResponse<TaskStats> = await apiClient.get(
      API_CONFIG.ENDPOINTS.TASKS.STATS
    );
    return response.data;
  }

  // Récupérer les statistiques des tâches d'un projet
  async getProjectTaskStats(projectId: number): Promise<TaskStats> {
    const response: ApiResponse<TaskStats> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.TASKS.PROJECT}/${projectId}/stats`
    );
    return response.data;
  }

  // Méthodes utilitaires
  async getTodoTasks(): Promise<Task[]> {
    return this.getTasksByStatus('TODO');
  }

  async getInProgressTasks(): Promise<Task[]> {
    return this.getTasksByStatus('IN_PROGRESS');
  }

  async getOnHoldTasks(): Promise<Task[]> {
    return this.getTasksByStatus('ON_HOLD');
  }

  async getCompletedTasks(): Promise<Task[]> {
    return this.getTasksByStatus('COMPLETED');
  }

  async getHighPriorityTasks(): Promise<Task[]> {
    return this.getTasksByPriority('HIGH');
  }

  async getMediumPriorityTasks(): Promise<Task[]> {
    return this.getTasksByPriority('MEDIUM');
  }

  async getLowPriorityTasks(): Promise<Task[]> {
    return this.getTasksByPriority('LOW');
  }

  // Marquer une tâche comme terminée
  async completeTask(id: number): Promise<Task> {
    return this.updateTaskStatus(id, 'COMPLETED');
  }

  // Marquer une tâche comme en cours
  async startTask(id: number): Promise<Task> {
    return this.updateTaskStatus(id, 'IN_PROGRESS');
  }

  // Mettre une tâche en attente
  async holdTask(id: number): Promise<Task> {
    return this.updateTaskStatus(id, 'ON_HOLD');
  }
}

// Instance singleton du service des tâches
export const tasksService = new TasksService();
