"use client"

import { LoadingSpinner } from "./loading-spinner"
import { Skeleton } from "./skeleton"
import { PageLoading } from "./page-loading"

interface LoadingPageProps {
  message?: string
  showSkeleton?: boolean
}

export function LoadingPage({ message = "Chargement...", showSkeleton = false }: LoadingPageProps) {
  if (showSkeleton) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <PageLoading message={message} />
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Skeleton className="h-32 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
