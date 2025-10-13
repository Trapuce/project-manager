import { create } from 'zustand';
import { usersService } from '@/lib/api';
import type { User, UserStats } from '@/lib/api';

interface UsersState {
  // État
  users: User[];
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  
  // Filtres et pagination
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Actions
  loadUsers: () => Promise<void>;
  loadStats: () => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (id: number, userData: any) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  
  // Filtres
  setSearchQuery: (query: string) => void;
  setRoleFilter: (role: string) => void;
  setStatusFilter: (status: string) => void;
  clearFilters: () => void;
  
  // Pagination
  setCurrentPage: (page: number) => void;
  
  // Utilitaires
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  // État initial
  users: [],
  stats: null,
  isLoading: false,
  error: null,
  
  // Filtres et pagination
  searchQuery: '',
  roleFilter: 'ALL',
  statusFilter: 'ALL',
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,

  // Actions
  loadUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { searchQuery, roleFilter, statusFilter, currentPage } = get();
      
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (roleFilter !== 'ALL') params.append('role', roleFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('page', currentPage.toString());
      params.append('size', '20');
      
      const response = await usersService.getAllUsers(params.toString());
      
      set({
        users: response.data || [],
        totalPages: response.totalPages || 1,
        totalItems: response.totalElements || 0,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        users: [],
        isLoading: false,
        error: error.message || 'Erreur lors du chargement des utilisateurs',
      });
    }
  },

  loadStats: async () => {
    try {
      const stats = await usersService.getUserStats();
      set({ stats });
    } catch (error: any) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      await usersService.createUser(userData);
      await get().loadUsers();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la création de l\'utilisateur',
      });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    
    try {
      await usersService.updateUser(id, userData);
      await get().loadUsers();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la mise à jour de l\'utilisateur',
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await usersService.deleteUser(id);
      await get().loadUsers();
      await get().loadStats();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la suppression de l\'utilisateur',
      });
      throw error;
    }
  },

  // Filtres
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().loadUsers();
  },

  setRoleFilter: (role) => {
    set({ roleFilter: role, currentPage: 1 });
    get().loadUsers();
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status, currentPage: 1 });
    get().loadUsers();
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      roleFilter: 'ALL',
      statusFilter: 'ALL',
      currentPage: 1,
    });
    get().loadUsers();
  },

  // Pagination
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().loadUsers();
  },

  // Utilitaires
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
