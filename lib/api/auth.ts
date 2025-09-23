import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ApiResponse,
} from './config';

export class AuthService {
  // Connexion utilisateur
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: ApiResponse<AuthResponse> = await apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials,
      false // Ne pas inclure l'authentification pour la connexion
    );

    if (response.success && response.data) {
      // Sauvegarder les tokens
      apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  }

  // Inscription utilisateur
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: ApiResponse<AuthResponse> = await apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData,
      false // Ne pas inclure l'authentification pour l'inscription
    );

    if (response.success && response.data) {
      // Sauvegarder les tokens
      apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  }

  // Rafraîchir le token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const request: RefreshTokenRequest = { refreshToken };
    const response: ApiResponse<AuthResponse> = await apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      request,
      false
    );

    if (response.success && response.data) {
      // Sauvegarder les nouveaux tokens
      apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  }

  // Déconnexion
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Supprimer les tokens même si la requête échoue
      apiClient.clearTokens();
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  // Obtenir le token d'accès
  getAccessToken(): string | null {
    return apiClient.getAccessToken();
  }

  // Vérifier si le token est expiré (approximation basée sur la durée)
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      // Décoder le JWT pour vérifier l'expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }
}

// Instance singleton du service d'authentification
export const authService = new AuthService();
