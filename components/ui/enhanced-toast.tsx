"use client"

import { toast } from "sonner"
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from "lucide-react"

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const enhancedToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    })
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action,
      icon: <XCircle className="h-4 w-4 text-red-600" />,
    })
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action,
      icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    })
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      icon: <Info className="h-4 w-4 text-blue-600" />,
    })
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      description: options?.description,
      icon: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />,
    })
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId)
  },

  dismissAll: () => {
    toast.dismiss()
  },
}
