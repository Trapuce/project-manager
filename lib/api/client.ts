import { API_CONFIG, ApiResponse } from './config';

// Classe pour gérer les requêtes HTTP
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.loadTokensFromStorage();
  }

  // Charger les tokens depuis le localStorage
  private loadTokensFromStorage() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  // Sauvegarder les tokens dans le localStorage
  private saveTokensToStorage(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Supprimer les tokens du localStorage
  private clearTokensFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Obtenir les headers par défaut
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Gérer les erreurs de réponse
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expiré, essayer de le rafraîchir
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry la requête avec le nouveau token
          const retryResponse = await fetch(response.url, {
            method: response.url.includes('refresh') ? 'POST' : 'GET',
            headers: this.getHeaders(),
          });
          if (retryResponse.ok) {
            return retryResponse.json();
          }
        }
        // Si le refresh échoue, rediriger vers la page de connexion
        this.clearTokensFromStorage();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
      
      // Essayer de récupérer le message d'erreur détaillé
      try {
        const errorData = await response.json();
        if (errorData.message) {
          throw new Error(errorData.message);
        }
      } catch (parseError) {
        // Si on ne peut pas parser le JSON, utiliser le message par défaut
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Rafraîchir le token d'accès
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data: ApiResponse<{ accessToken: string; refreshToken: string }> = await response.json();
        this.saveTokensToStorage(data.data.accessToken, data.data.refreshToken);
        return true;
      }
    } catch (error) {
      // Erreur silencieuse lors du rafraîchissement du token
    }

    return false;
  }

  // Méthodes HTTP de base
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // Upload de fichier
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {};
    
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  // Méthodes pour gérer l'authentification
  setTokens(accessToken: string, refreshToken: string) {
    this.saveTokensToStorage(accessToken, refreshToken);
  }

  clearTokens() {
    this.clearTokensFromStorage();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient();
