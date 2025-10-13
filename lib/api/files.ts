import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  FileAttachment,
  FileUploadRequest,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from './config';

export class FilesService {
  // Obtenir les fichiers d'un projet
  async getFilesByProject(projectId: number, params?: SearchParams): Promise<PaginatedResponse<FileAttachment>> {
    const response: ApiResponse<PaginatedResponse<FileAttachment>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.BY_PROJECT(projectId),
      params
    );
    return response.data;
  }

  // Obtenir les fichiers d'une tâche
  async getFilesByTask(taskId: number, params?: SearchParams): Promise<PaginatedResponse<FileAttachment>> {
    const response: ApiResponse<PaginatedResponse<FileAttachment>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.BY_TASK(taskId),
      params
    );
    return response.data;
  }

  // Rechercher des fichiers
  async searchFiles(query: string, params?: SearchParams): Promise<PaginatedResponse<FileAttachment>> {
    const searchParams = { ...params, search: query };
    const response: ApiResponse<PaginatedResponse<FileAttachment>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Uploader un fichier
  async uploadFile(file: File, projectId?: number, taskId?: number): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (projectId) {
      formData.append('projectId', projectId.toString());
    }
    
    if (taskId) {
      formData.append('taskId', taskId.toString());
    }

    const response: ApiResponse<FileAttachment> = await apiClient.uploadFile(
      API_CONFIG.ENDPOINTS.FILES.UPLOAD,
      formData
    );
    return response.data;
  }

  // Uploader une image de profil
  async uploadProfileImage(file: File): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'profile');

    const response: ApiResponse<FileAttachment> = await apiClient.uploadFile(
      API_CONFIG.ENDPOINTS.FILES.UPLOAD,
      formData
    );
    return response.data;
  }

  // Uploader plusieurs fichiers
  async uploadMultipleFiles(files: File[], projectId?: number, taskId?: number): Promise<FileAttachment[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, projectId, taskId));
    return Promise.all(uploadPromises);
  }

  // Télécharger un fichier
  async downloadFile(fileId: number): Promise<Blob> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILES.DOWNLOAD(fileId)}`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  // Obtenir l'URL de téléchargement d'un fichier
  getDownloadUrl(fileId: number): string {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILES.DOWNLOAD(fileId)}`;
  }

  // Supprimer un fichier
  async deleteFile(fileId: number): Promise<void> {
    await apiClient.delete(`/api/files/${fileId}`);
  }

  // Obtenir les fichiers par type
  async getFilesByType(contentType: string, params?: SearchParams): Promise<PaginatedResponse<FileAttachment>> {
    const searchParams = { ...params, contentType };
    const response: ApiResponse<PaginatedResponse<FileAttachment>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Obtenir les fichiers par taille
  async getFilesBySize(minSize?: number, maxSize?: number, params?: SearchParams): Promise<PaginatedResponse<FileAttachment>> {
    const searchParams = { ...params };
    if (minSize !== undefined) searchParams.minSize = minSize;
    if (maxSize !== undefined) searchParams.maxSize = maxSize;
    
    const response: ApiResponse<PaginatedResponse<FileAttachment>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Obtenir les fichiers récents
  async getRecentFiles(limit: number = 10): Promise<FileAttachment[]> {
    const response: ApiResponse<FileAttachment[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.SEARCH,
      { limit, sort: 'uploadedAt,desc' }
    );
    return response.data;
  }

  // Obtenir les fichiers par utilisateur
  async getFilesByUser(userId: number, params?: SearchParams): Promise<PaginatedResponse<FileAttachment>> {
    const searchParams = { ...params, uploadedBy: userId };
    const response: ApiResponse<PaginatedResponse<FileAttachment>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Obtenir les fichiers par date
  async getFilesByDateRange(startDate: string, endDate: string, params?: SearchParams): Promise<PaginatedResponse<FileAttachment>> {
    const searchParams = { ...params, startDate, endDate };
    const response: ApiResponse<PaginatedResponse<FileAttachment>> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Obtenir les statistiques des fichiers
  async getFileStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Record<string, number>;
    filesByProject: Record<number, number>;
  }> {
    const response: ApiResponse<{
      totalFiles: number;
      totalSize: number;
      filesByType: Record<string, number>;
      filesByProject: Record<number, number>;
    }> = await apiClient.get('/api/files/stats');
    return response.data;
  }

  // Vérifier si un fichier est une image
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  // Vérifier si un fichier est un document
  isDocumentFile(file: File): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv'
    ];
    return documentTypes.includes(file.type);
  }

  // Formater la taille d'un fichier
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Obtenir l'icône d'un fichier basée sur son type
  getFileIcon(contentType: string): string {
    if (contentType.startsWith('image/')) return '🖼️';
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('word')) return '📝';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return '📈';
    if (contentType.includes('text')) return '📃';
    if (contentType.includes('video')) return '🎥';
    if (contentType.includes('audio')) return '🎵';
    if (contentType.includes('zip') || contentType.includes('rar')) return '📦';
    return '📎';
  }
}

// Instance singleton du service des fichiers
export const filesService = new FilesService();