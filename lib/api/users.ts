import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  User,
  UserStats,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from './config';

export class UsersService {
  // Obtenir tous les utilisateurs (Admin seulement)
  async getAllUsers(params?: SearchParams): Promise<PaginatedResponse<User>> {
    const response: ApiResponse<PaginatedResponse<User>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      params
    );
    return response.data;
  }

  // Obtenir le profil de l'utilisateur connecté
  async getProfile(): Promise<User> {
    const response: ApiResponse<User> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.PROFILE
    );
    return response.data;
  }

  // Obtenir un utilisateur par ID
  async getUserById(id: number): Promise<User> {
    const response: ApiResponse<User> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data;
  }

  // Rechercher des utilisateurs
  async searchUsers(query: string, params?: SearchParams): Promise<PaginatedResponse<User>> {
    const searchParams = { ...params, query };
    const response: ApiResponse<PaginatedResponse<User>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Obtenir les statistiques des utilisateurs
  async getUserStats(): Promise<UserStats> {
    const response: ApiResponse<UserStats> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.STATS
    );
    return response.data;
  }

  // Mettre à jour le profil utilisateur
  async updateProfile(userData: Partial<User>): Promise<User> {
    // Récupérer l'ID de l'utilisateur depuis le token ou les données
    const currentUser = await this.getProfile();
    const response: ApiResponse<User> = await apiClient.put(
      API_CONFIG.ENDPOINTS.USERS.BY_ID(currentUser.id),
      userData
    );
    return response.data;
  }

  // Changer le mot de passe
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Essayer différentes structures de données
    const passwordDataVariants = [
      { currentPassword, newPassword },
      { oldPassword: currentPassword, newPassword },
      { current_password: currentPassword, new_password: newPassword },
      { old_password: currentPassword, new_password: newPassword },
      { password: currentPassword, newPassword },
      { password: currentPassword, new_password: newPassword }
    ];

    // Essayer plusieurs endpoints possibles
    const endpoints = [
      API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD,
      API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD,
      API_CONFIG.ENDPOINTS.USERS.PROFILE
    ];

    let lastError: any = null;

    // Essayer chaque combinaison d'endpoint et de structure de données
    for (const endpoint of endpoints) {
      for (const passwordData of passwordDataVariants) {
        try {
          await apiClient.put(endpoint, passwordData);
          return; // Succès, sortir de la fonction
        } catch (error: any) {
          lastError = error;
        }
      }
    }

    // Si tous les endpoints échouent, essayer avec l'ID utilisateur
    try {
      const currentUser = await this.getProfile();
      for (const passwordData of passwordDataVariants) {
        try {
          await apiClient.put(
            API_CONFIG.ENDPOINTS.USERS.BY_ID(currentUser.id),
            passwordData
          );
          return; // Succès
        } catch (error: any) {
          lastError = error;
        }
      }
    } catch (error: any) {
      // Erreur lors de la récupération du profil
    }

    // Si tout échoue, lancer la dernière erreur
    throw lastError || new Error('Impossible de changer le mot de passe');
  }

  // Obtenir les utilisateurs par rôle
  async getUsersByRole(role: 'ADMIN' | 'MANAGER' | 'MEMBER'): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      { role }
    );
    return response.data;
  }

  // Obtenir les utilisateurs par département
  async getUsersByDepartment(department: string): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      { department }
    );
    return response.data;
  }

  // Obtenir les utilisateurs actifs
  async getActiveUsers(): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      { status: 'ACTIVE' }
    );
    return response.data;
  }

  // Obtenir les utilisateurs inactifs
  async getInactiveUsers(): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      { status: 'INACTIVE' }
    );
    return response.data;
  }

  // Obtenir les utilisateurs en attente
  async getPendingUsers(): Promise<User[]> {
    const response: ApiResponse<User[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.USERS.BASE,
      { status: 'PENDING' }
    );
    return response.data;
  }
}

// Instance singleton du service des utilisateurs
export const usersService = new UsersService();