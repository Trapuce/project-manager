"use client"

import { Skeleton } from "./skeleton"
import { SkeletonGrid, SkeletonList } from "./skeleton-card"

interface LoadingSkeletonProps {
  type?: "grid" | "list" | "page"
  count?: number
  className?: string
}

export function LoadingSkeleton({ type = "grid", count = 6, className }: LoadingSkeletonProps) {
  if (type === "page") {
    return (
      <div className={`space-y-6 p-6 ${className}`}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
        <SkeletonGrid count={count} />
      </div>
    )
  }

  if (type === "list") {
    return <SkeletonList count={count} />
  }

  return <SkeletonGrid count={count} />
}
