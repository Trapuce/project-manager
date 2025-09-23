import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  File,
  FileUploadRequest,
  ApiResponse,
  SearchParams,
} from './config';

export class FilesService {
  // Uploader un fichier
  async uploadFile(file: globalThis.File, projectId?: number, taskId?: number): Promise<File> {
    // Vérifier la taille du fichier
    if (file.size > API_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed size of ${API_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Vérifier le type de fichier
    if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    const formData = new FormData();
    formData.append('file', file);
    
    if (projectId) {
      formData.append('projectId', projectId.toString());
    }
    
    if (taskId) {
      formData.append('taskId', taskId.toString());
    }

    const response: ApiResponse<File> = await apiClient.uploadFile(
      API_CONFIG.ENDPOINTS.FILES.UPLOAD,
      formData
    );
    return response.data;
  }

  // Télécharger un fichier
  async downloadFile(fileId: number): Promise<Blob> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILES.DOWNLOAD}/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  // Télécharger un fichier et l'ouvrir dans un nouvel onglet
  async downloadAndOpenFile(fileId: number, fileName: string): Promise<void> {
    const blob = await this.downloadFile(fileId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Récupérer les fichiers d'un projet
  async getProjectFiles(projectId: number, params?: SearchParams): Promise<File[]> {
    const response: ApiResponse<File[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.FILES.PROJECT}/${projectId}`,
      params
    );
    return response.data;
  }

  // Récupérer les fichiers d'une tâche
  async getTaskFiles(taskId: number, params?: SearchParams): Promise<File[]> {
    const response: ApiResponse<File[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.FILES.TASK}/${taskId}`,
      params
    );
    return response.data;
  }

  // Rechercher des fichiers
  async searchFiles(searchTerm: string, params?: SearchParams): Promise<File[]> {
    const searchParams = { search: searchTerm, ...params };
    const response: ApiResponse<File[]> = await apiClient.get(
      API_CONFIG.ENDPOINTS.FILES.SEARCH,
      searchParams
    );
    return response.data;
  }

  // Récupérer les fichiers par type MIME
  async getFilesByContentType(contentType: string): Promise<File[]> {
    const response: ApiResponse<File[]> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.FILES.CONTENT_TYPE}/${encodeURIComponent(contentType)}`
    );
    return response.data;
  }

  // Récupérer la taille totale des fichiers d'un projet
  async getProjectFilesSize(projectId: number): Promise<{ totalSize: number; fileCount: number }> {
    const response: ApiResponse<{ totalSize: number; fileCount: number }> = await apiClient.get(
      `${API_CONFIG.ENDPOINTS.FILES.PROJECT}/${projectId}/size`
    );
    return response.data;
  }

  // Supprimer un fichier
  async deleteFile(fileId: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.FILES.DOWNLOAD.replace('/download', '')}/${fileId}`);
  }

  // Méthodes utilitaires
  async getImageFiles(projectId?: number, taskId?: number): Promise<File[]> {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const files: File[] = [];
    
    for (const contentType of imageTypes) {
      const typeFiles = await this.getFilesByContentType(contentType);
      files.push(...typeFiles);
    }

    // Filtrer par projet ou tâche si spécifié
    if (projectId) {
      return files.filter(file => file.project?.id === projectId);
    }
    
    if (taskId) {
      return files.filter(file => file.task?.id === taskId);
    }

    return files;
  }

  async getDocumentFiles(projectId?: number, taskId?: number): Promise<File[]> {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    const files: File[] = [];
    
    for (const contentType of documentTypes) {
      const typeFiles = await this.getFilesByContentType(contentType);
      files.push(...typeFiles);
    }

    // Filtrer par projet ou tâche si spécifié
    if (projectId) {
      return files.filter(file => file.project?.id === projectId);
    }
    
    if (taskId) {
      return files.filter(file => file.task?.id === taskId);
    }

    return files;
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
    if (contentType.startsWith('image/')) {
      return '🖼️';
    } else if (contentType === 'application/pdf') {
      return '📄';
    } else if (contentType.includes('word') || contentType.includes('document')) {
      return '📝';
    } else if (contentType === 'text/plain') {
      return '📄';
    } else {
      return '📎';
    }
  }

  // Vérifier si un fichier est une image
  isImageFile(contentType: string): boolean {
    return contentType.startsWith('image/');
  }

  // Vérifier si un fichier est un document
  isDocumentFile(contentType: string): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    return documentTypes.includes(contentType);
  }
}

// Instance singleton du service des fichiers
export const filesService = new FilesService();
