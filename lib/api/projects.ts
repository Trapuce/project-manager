import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  Project,
  ProjectStats,
  CreateProjectRequest,
  UpdateProjectRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from './config';

export class ProjectsService {
  // Obtenir tous les projets (Admin seulement)
  async getAllProjects(params?: SearchParams): Promise<PaginatedResponse<Project>> {
    const response: ApiResponse<PaginatedResponse<Project>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      params
    );
    return response.data;
  }

  // Obtenir un projet par ID
  async getProjectById(id: number): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id)
    );
    return response.data;
  }

  // Obtenir mes projets (pour les membres)
  async getMyProjects(params?: SearchParams): Promise<PaginatedResponse<Project>> {
    const response: ApiResponse<PaginatedResponse<Project>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.MY_PROJECTS,
      params
    );
    return response.data;
  }

  // Créer un nouveau projet (Manager/Admin)
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
      API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id),
      projectData
    );
    return response.data;
  }

  // Supprimer un projet
  async deleteProject(id: number): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id));
  }

  // Rechercher des projets
  async searchProjects(query: string, params?: SearchParams): Promise<PaginatedResponse<Project>> {
    const searchParams = { ...params, query };
    const response: ApiResponse<PaginatedResponse<Project>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Obtenir les statistiques des projets
  async getProjectStats(): Promise<ProjectStats> {
    const response: ApiResponse<ProjectStats> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.STATS
    );
    return response.data;
  }

  // Ajouter un membre à un projet
  async addMemberToProject(projectId: number, userId: number): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.post(
      `${API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(projectId)}/members`,
      { userId }
    );
    return response.data;
  }

  // Retirer un membre d'un projet
  async removeMemberFromProject(projectId: number, userId: number): Promise<Project> {
    const response: ApiResponse<Project> = await apiClient.delete(
      `${API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(projectId)}/members/${userId}`
    );
    return response.data;
  }

  // Obtenir les projets par statut
  async getProjectsByStatus(status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'PLANNING'): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      { status }
    );
    return response.data;
  }

  // Obtenir les projets par priorité
  async getProjectsByPriority(priority: 'LOW' | 'MEDIUM' | 'HIGH'): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      { priority }
    );
    return response.data;
  }

  // Obtenir les projets en retard
  async getOverdueProjects(): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      { overdue: true }
    );
    return response.data;
  }

  // Obtenir les projets récents
  async getRecentProjects(limit: number = 10): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      { limit, sort: 'createdAt,desc' }
    );
    return response.data;
  }

  // Obtenir les projets par propriétaire
  async getProjectsByOwner(ownerId: number): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      { ownerId }
    );
    return response.data;
  }

  // Obtenir les projets par membre
  async getProjectsByMember(memberId: number): Promise<Project[]> {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.PROJECTS.BASE,
      { memberId }
    );
    return response.data;
  }
}

// Instance singleton du service des projets
export const projectsService = new ProjectsService();