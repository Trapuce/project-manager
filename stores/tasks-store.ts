import { create } from 'zustand';
import { tasksService } from '@/lib/api';
import type { Task, TaskStats } from '@/lib/api';

interface TasksState {
  // État
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtres et pagination
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
  projectFilter: string;
  assignedToFilter: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Actions
  loadTasks: () => Promise<void>;
  loadStats: () => Promise<void>;
  createTask: (taskData: any) => Promise<void>;
  updateTask: (id: number, taskData: any) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  
  // Filtres
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  setProjectFilter: (project: string) => void;
  setAssignedToFilter: (assignedTo: string) => void;
  clearFilters: () => void;
  
  // Pagination
  setCurrentPage: (page: number) => void;
  
  // Utilitaires
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  // État initial
  tasks: [],
  stats: null,
  isLoading: false,
  error: null,
  
  // Filtres et pagination
  searchQuery: '',
  statusFilter: 'ALL_STATUSES',
  priorityFilter: 'ALL_PRIORITIES',
  projectFilter: 'ALL_PROJECTS',
  assignedToFilter: 'ALL_USERS',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,

  // Actions
  loadTasks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { 
        searchQuery, 
        statusFilter, 
        priorityFilter, 
        projectFilter, 
        assignedToFilter, 
        currentPage 
      } = get();
      
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'ALL_STATUSES') params.append('status', statusFilter);
      if (priorityFilter !== 'ALL_PRIORITIES') params.append('priority', priorityFilter);
      if (projectFilter !== 'ALL_PROJECTS') params.append('projectId', projectFilter);
      if (assignedToFilter !== 'ALL_USERS') params.append('assignedToId', assignedToFilter);
      params.append('page', currentPage.toString());
      params.append('size', '20');
      
      const response = await tasksService.getAllTasks(params.toString());
      
      set({
        tasks: response.data || [],
        totalPages: response.totalPages || 1,
        totalItems: response.totalElements || 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        tasks: [],
        isLoading: false,
        error: error.message || 'Erreur lors du chargement des tâches',
      });
    }
  },

  loadStats: async () => {
    try {
      const stats = await tasksService.getTaskStats();
      set({ stats });
    } catch (error: any) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    
    try {
      await tasksService.createTask(taskData);
      await get().loadTasks();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la création de la tâche',
      });
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    
    try {
      await tasksService.updateTask(id, taskData);
      await get().loadTasks();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la mise à jour de la tâche',
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await tasksService.deleteTask(id);
      await get().loadTasks();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la suppression de la tâche',
      });
      throw error;
    }
  },

  // Filtres
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().loadTasks();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 });
    get().loadTasks();
  },

  setPriorityFilter: (priority) => {
    set({ priorityFilter: priority, currentPage: 1 });
    get().loadTasks();
  },

  setProjectFilter: (project) => {
    set({ projectFilter: project, currentPage: 1 });
    get().loadTasks();
  },

  setAssignedToFilter: (assignedTo) => {
    set({ assignedToFilter: assignedTo, currentPage: 1 });
    get().loadTasks();
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      statusFilter: 'ALL_STATUSES',
      priorityFilter: 'ALL_PRIORITIES',
      projectFilter: 'ALL_PROJECTS',
      assignedToFilter: 'ALL_USERS',
      currentPage: 1,
    });
    get().loadTasks();
  },

  // Pagination
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().loadTasks();
  },

  // Utilitaires
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
