import { create } from 'zustand';
import { projectsService } from '@/lib/api';
import type { Project, ProjectStats } from '@/lib/api';

interface ProjectsState {
  // État
  projects: Project[];
  stats: ProjectStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtres et pagination
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Actions
  loadProjects: () => Promise<void>;
  loadStats: () => Promise<void>;
  createProject: (projectData: any) => Promise<void>;
  updateProject: (id: number, projectData: any) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  
  // Filtres
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  clearFilters: () => void;
  
  // Pagination
  setCurrentPage: (page: number) => void;
  
  // Utilitaires
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  // État initial
  projects: [],
  stats: null,
  isLoading: false,
  error: null,
  
  // Filtres et pagination
  searchQuery: '',
  statusFilter: 'ALL_STATUSES',
  priorityFilter: 'ALL_PRIORITIES',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,

  // Actions
  loadProjects: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { searchQuery, statusFilter, priorityFilter, currentPage } = get();
      
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'ALL_STATUSES') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL_PRIORITIES') params.append('priority', priorityFilter);
      params.append('page', currentPage.toString());
      params.append('size', '20');
      
      const response = await projectsService.getAllProjects(params.toString());
      
      set({
        projects: response.data || [],
        totalPages: response.totalPages || 1,
        totalItems: response.totalElements || 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        projects: [],
        isLoading: false,
        error: error.message || 'Erreur lors du chargement des projets',
      });
    }
  },

  loadStats: async () => {
    try {
      const stats = await projectsService.getProjectStats();
      set({ stats });
    } catch (error: any) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  },

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    
    try {
      await projectsService.createProject(projectData);
      await get().loadProjects();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la création du projet',
      });
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    set({ isLoading: true, error: null });
    
    try {
      await projectsService.updateProject(id, projectData);
      await get().loadProjects();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la mise à jour du projet',
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await projectsService.deleteProject(id);
      await get().loadProjects();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la suppression du projet',
      });
      throw error;
    }
  },

  // Filtres
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().loadProjects();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 });
    get().loadProjects();
  },

  setPriorityFilter: (priority) => {
    set({ priorityFilter: priority, currentPage: 1 });
    get().loadProjects();
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      statusFilter: 'ALL_STATUSES',
      priorityFilter: 'ALL_PRIORITIES',
      currentPage: 1,
    });
    get().loadProjects();
  },

  // Pagination
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().loadProjects();
  },

  // Utilitaires
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));