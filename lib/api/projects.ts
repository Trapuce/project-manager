import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectStats,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
  DateRangeParams,
} from './config';

export class ProjectsService {
  // Récupérer tous les projets (paginé)
  async getProjects(params?: SearchParams): Promise<PaginatedResponse<Project>> {
    const response: ApiResponse<PaginatedResponse<Project>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      params
    );
    return response.data;
  }

  // Récupérer les projets de l'utilisateur connecté
  async getMyProjects(params?: SearchParams): Promise<PaginatedResponse<Project>> {
    const response: ApiResponse<PaginatedResponse<Project>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.MY_PROJECTS,
      params
    );
    return response.data;
  }

  // Récupérer un projet par ID
  async getProjectById(id: number): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/${id}`
    );
    return response.data;
  }

  // Rechercher des projets
  async searchProjects(searchTerm: string, params?: SearchParams): Promise<PaginatedResponse<Project>> {
    const searchParams = { search: searchTerm, ...params };
    const response: ApiResponse<PaginatedResponse<Project>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Récupérer les projets par statut
  async getProjectsByStatus(status: 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED'): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.PROJECTS.STATUS}/${status}`
    );
    return response.data;
  }

  // Récupérer les projets par priorité
  async getProjectsByPriority(priority: 'LOW' | 'MEDIUM' | 'HIGH'): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.PROJECTS.PRIORITY}/${priority}`
    );
    return response.data;
  }

  // Récupérer les projets par plage de dates
  async getProjectsByDateRange(dateRange: DateRangeParams): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.DUE_DATE,
      dateRange
    );
    return response.data;
  }

  // Récupérer les projets en retard
  async getOverdueProjects(): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.OVERDUE
    );
    return response.data;
  }

  // Créer un nouveau projet
  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.post(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      projectData
    );
    return response.data;
  }

  // Mettre à jour un projet
  async updateProject(id: number, projectData: UpdateProjectRequest): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/${id}`,
      projectData
    );
    return response.data;
  }

  // Changer le statut d'un projet
  async updateProjectStatus(id: number, status: 'TODO' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED'): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/${id}/status?status=${status}`
    );
    return response.data;
  }

  // Ajouter un membre au projet
  async addProjectMember(projectId: number, userId: number): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/${projectId}/members/${userId}`
    );
    return response.data;
  }

  // Retirer un membre du projet
  async removeProjectMember(projectId: number, userId: number): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.delete(
      `${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/${projectId}/members/${userId}`
    );
    return response.data;
  }

  // Supprimer un projet
  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.PROJECTS.BASE}/${id}`);
  }

  // Récupérer les statistiques des projets
  async getProjectStats(): Promise<ProjectStats> {
    const response: ApiResponse<ProjectStats> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.STATS
    );
    return response.data;
  }

  // Méthodes utilitaires
  async getTodoProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('TODO');
  }

  async getInProgressProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('IN_PROGRESS');
  }

  async getOnHoldProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('ON_HOLD');
  }

  async getCompletedProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('COMPLETED');
  }

  async getArchivedProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('ARCHIVED');
  }

  async getHighPriorityProjects(): Promise<Project[]> {
    return this.getProjectsByPriority('HIGH');
  }

  async getMediumPriorityProjects(): Promise<Project[]> {
    return this.getProjectsByPriority('MEDIUM');
  }

  async getLowPriorityProjects(): Promise<Project[]> {
    return this.getProjectsByPriority('LOW');
  }
}

// Instance singleton du service des projets
export const projectsService = new ProjectsService();
