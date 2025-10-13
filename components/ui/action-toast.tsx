"use client"

import { toast } from "sonner"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Loader2,
  Plus,
  Edit,
  Trash2,
  LogOut,
  LogIn,
  Save,
  RefreshCw,
  User,
  FolderOpen,
  CheckSquare,
  Calendar,
  Settings
} from "lucide-react"

interface ActionToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const actionToast = {
  // Création
  createSuccess: (item: string, options?: ActionToastOptions) => {
    toast.success(`${item} créé(e) avec succès`, {
      description: options?.description || `Le/La ${item.toLowerCase()} a été créé(e) et ajouté(e) à votre liste.`,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <Plus className="h-4 w-4" />,
      style: {
        background: '#10b981',
        color: 'white',
        border: '1px solid #059669'
      }
    })
  },

  createError: (item: string, options?: ActionToastOptions) => {
    toast.error(`Erreur lors de la création`, {
      description: options?.description || `Impossible de créer le/la ${item.toLowerCase()}. Veuillez réessayer.`,
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4" />,
      style: {
        background: '#ef4444',
        color: 'white',
        border: '1px solid #dc2626'
      }
    })
  },

  // Mise à jour
  updateSuccess: (item: string, options?: ActionToastOptions) => {
    toast.success(`${item} mis(e) à jour`, {
      description: options?.description || `Le/La ${item.toLowerCase()} a été modifié(e) avec succès.`,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <Edit className="h-4 w-4" />,
      style: {
        background: '#3b82f6',
        color: 'white',
        border: '1px solid #2563eb'
      }
    })
  },

  updateError: (item: string, options?: ActionToastOptions) => {
    toast.error(`Erreur lors de la mise à jour`, {
      description: options?.description || `Impossible de modifier le/la ${item.toLowerCase()}. Veuillez réessayer.`,
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4" />,
      style: {
        background: '#ef4444',
        color: 'white',
        border: '1px solid #dc2626'
      }
    })
  },

  // Suppression
  deleteSuccess: (item: string, options?: ActionToastOptions) => {
    toast.success(`${item} supprimé(e)`, {
      description: options?.description || `Le/La ${item.toLowerCase()} a été supprimé(e) avec succès.`,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <Trash2 className="h-4 w-4" />,
      style: {
        background: '#f97316',
        color: 'white',
        border: '1px solid #ea580c'
      }
    })
  },

  deleteError: (item: string, options?: ActionToastOptions) => {
    toast.error(`Erreur lors de la suppression`, {
      description: options?.description || `Impossible de supprimer le/la ${item.toLowerCase()}. Veuillez réessayer.`,
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4" />,
      style: {
        background: '#ef4444',
        color: 'white',
        border: '1px solid #dc2626'
      }
    })
  },

  // Connexion/Déconnexion
  loginSuccess: (userName?: string, options?: ActionToastOptions) => {
    toast.success("Connexion réussie", {
      description: options?.description || `Bienvenue${userName ? ` ${userName}` : ''} ! Vous êtes maintenant connecté(e).`,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <LogIn className="h-4 w-4" />,
      style: {
        background: '#10b981',
        color: 'white',
        border: '1px solid #059669'
      }
    })
  },

  loginError: (options?: ActionToastOptions) => {
    toast.error("Erreur de connexion", {
      description: options?.description || "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.",
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4" />,
      style: {
        background: '#ef4444',
        color: 'white',
        border: '1px solid #dc2626'
      }
    })
  },

  logoutSuccess: (options?: ActionToastOptions) => {
    toast.success("Déconnexion réussie", {
      description: options?.description || "Vous avez été déconnecté(e) avec succès. À bientôt !",
      duration: options?.duration || 3000,
      action: options?.action,
      icon: <LogOut className="h-4 w-4" />,
      style: {
        background: '#3b82f6',
        color: 'white',
        border: '1px solid #2563eb'
      }
    })
  },

  logoutError: (options?: ActionToastOptions) => {
    toast.error("Erreur de déconnexion", {
      description: options?.description || "Une erreur est survenue lors de la déconnexion.",
      duration: options?.duration || 5000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4 text-red-600" />,
    })
  },

  // Inscription
  registerSuccess: (userName?: string, options?: ActionToastOptions) => {
    toast.success("Inscription réussie", {
      description: options?.description || `Compte créé avec succès${userName ? ` pour ${userName}` : ''}. Vous pouvez maintenant vous connecter.`,
      duration: options?.duration || 5000,
      action: options?.action,
      icon: <User className="h-4 w-4 text-green-600" />,
    })
  },

  registerError: (options?: ActionToastOptions) => {
    toast.error("Erreur d'inscription", {
      description: options?.description || "Impossible de créer votre compte. Veuillez vérifier vos informations.",
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4 text-red-600" />,
    })
  },

  // Sauvegarde
  saveSuccess: (item: string, options?: ActionToastOptions) => {
    toast.success("Sauvegarde réussie", {
      description: options?.description || `Les modifications du/de la ${item.toLowerCase()} ont été sauvegardées.`,
      duration: options?.duration || 3000,
      action: options?.action,
      icon: <Save className="h-4 w-4 text-green-600" />,
    })
  },

  saveError: (item: string, options?: ActionToastOptions) => {
    toast.error("Erreur de sauvegarde", {
      description: options?.description || `Impossible de sauvegarder le/la ${item.toLowerCase()}. Veuillez réessayer.`,
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4 text-red-600" />,
    })
  },

  // Rechargement
  refreshSuccess: (item: string, options?: ActionToastOptions) => {
    toast.success("Données actualisées", {
      description: options?.description || `La liste des ${item.toLowerCase()}s a été mise à jour.`,
      duration: options?.duration || 3000,
      action: options?.action,
      icon: <RefreshCw className="h-4 w-4 text-blue-600" />,
    })
  },

  refreshError: (item: string, options?: ActionToastOptions) => {
    toast.error("Erreur de rechargement", {
      description: options?.description || `Impossible de recharger les ${item.toLowerCase()}s. Veuillez réessayer.`,
      duration: options?.duration || 5000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4 text-red-600" />,
    })
  },

  // Actions spécifiques par type
  project: {
    createSuccess: (projectName: string, options?: ActionToastOptions) => {
      actionToast.createSuccess("Projet", {
        description: `Le projet "${projectName}" a été créé avec succès.`,
        ...options
      })
    },
    updateSuccess: (projectName: string, options?: ActionToastOptions) => {
      actionToast.updateSuccess("Projet", {
        description: `Le projet "${projectName}" a été modifié avec succès.`,
        ...options
      })
    },
    deleteSuccess: (projectName: string, options?: ActionToastOptions) => {
      actionToast.deleteSuccess("Projet", {
        description: `Le projet "${projectName}" a été supprimé avec succès.`,
        ...options
      })
    }
  },

  task: {
    createSuccess: (taskName: string, options?: ActionToastOptions) => {
      actionToast.createSuccess("Tâche", {
        description: `La tâche "${taskName}" a été créée avec succès.`,
        ...options
      })
    },
    updateSuccess: (taskName: string, options?: ActionToastOptions) => {
      actionToast.updateSuccess("Tâche", {
        description: `La tâche "${taskName}" a été modifiée avec succès.`,
        ...options
      })
    },
    deleteSuccess: (taskName: string, options?: ActionToastOptions) => {
      actionToast.deleteSuccess("Tâche", {
        description: `La tâche "${taskName}" a été supprimée avec succès.`,
        ...options
      })
    }
  },

  user: {
    updateSuccess: (userName: string, options?: ActionToastOptions) => {
      actionToast.updateSuccess("Profil", {
        description: `Le profil de ${userName} a été mis à jour avec succès.`,
        ...options
      })
    },
    passwordChangeSuccess: (options?: ActionToastOptions) => {
      toast.success("Mot de passe modifié", {
        description: options?.description || "Votre mot de passe a été modifié avec succès.",
        duration: options?.duration || 4000,
        action: options?.action,
        icon: <Settings className="h-4 w-4 text-green-600" />,
      })
    }
  },

  // Toasts génériques
  success: (message: string, options?: ActionToastOptions) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    })
  },

  error: (message: string, options?: ActionToastOptions) => {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4 text-red-600" />,
    })
  },

  warning: (message: string, options?: ActionToastOptions) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action,
      icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    })
  },

  info: (message: string, options?: ActionToastOptions) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <Info className="h-4 w-4 text-blue-600" />,
    })
  },

  loading: (message: string, options?: ActionToastOptions) => {
    return toast.loading(message, {
      description: options?.description,
      icon: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />,
    })
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },

  dismissAll: () => {
    toast.dismiss()
  },
}
