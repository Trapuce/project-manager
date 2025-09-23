import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserStats,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from './config';

export class UsersService {
  // Récupérer tous les utilisateurs (paginé)
  async getUsers(params?: SearchParams): Promise<PaginatedResponse<User>> {
    const response: ApiResponse<PaginatedResponse<User>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      params
    );
    return response.data;
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: number): Promise<User> {
    const response: ApiResponse<User> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`
    );
    return response.data;
  }

  // Récupérer le profil de l'utilisateur connecté
  async getCurrentUserProfile(): Promise<User> {
    const response: ApiResponse<User> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.PROFILE
    );
    return response.data;
  }

  // Rechercher des utilisateurs
  async searchUsers(searchTerm: string, params?: SearchParams): Promise<PaginatedResponse<User>> {
    const searchParams = { search: searchTerm, ...params };
    const response: ApiResponse<PaginatedResponse<User>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Récupérer les utilisateurs par statut
  async getUsersByStatus(status: 'ACTIVE' | 'INACTIVE' | 'PENDING'): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.USERS.STATUS}/${status}`
    );
    return response.data;
  }

  // Récupérer les utilisateurs par rôle
  async getUsersByRole(role: 'ADMIN' | 'MANAGER' | 'MEMBER'): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.USERS.ROLE}/${role}`
    );
    return response.data;
  }

  // Récupérer les utilisateurs par département
  async getUsersByDepartment(department: string): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.USERS.DEPARTMENT}/${encodeURIComponent(department)}`
    );
    return response.data;
  }

  // Récupérer les utilisateurs d'un projet
  async getUsersByProject(projectId: number): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.USERS.PROJECT}/${projectId}`
    );
    return response.data;
  }

  // Mettre à jour un utilisateur
  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response: ApiResponse<User> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`,
      userData
    );
    return response.data;
  }

  // Changer le mot de passe d'un utilisateur
  async changePassword(id: number, passwordData: ChangePasswordRequest): Promise<void> {
    await apiClient.put(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}/password`,
      passwordData
    );
  }

  // Supprimer un utilisateur (admin seulement)
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}`);
  }

  // Désactiver un utilisateur (admin seulement)
  async deactivateUser(id: number): Promise<User> {
    const response: ApiResponse<User> = await apiClient.put(
      `${API_CONFIG.ENDPOINTS.USERS.BASE}/${id}/deactivate`
    );
    return response.data;
  }

  // Récupérer les statistiques des utilisateurs
  async getUserStats(): Promise<UserStats> {
    const response: ApiResponse<UserStats> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.STATS
    );
    return response.data;
  }

  // Méthodes utilitaires
  async getActiveUsers(): Promise<User[]> {
    return this.getUsersByStatus('ACTIVE');
  }

  async getInactiveUsers(): Promise<User[]> {
    return this.getUsersByStatus('INACTIVE');
  }

  async getPendingUsers(): Promise<User[]> {
    return this.getUsersByStatus('PENDING');
  }

  async getAdmins(): Promise<User[]> {
    return this.getUsersByRole('ADMIN');
  }

  async getManagers(): Promise<User[]> {
    return this.getUsersByRole('MANAGER');
  }

  async getMembers(): Promise<User[]> {
    return this.getUsersByRole('MEMBER');
  }
}

// Instance singleton du service des utilisateurs
export const usersService = new UsersService();
