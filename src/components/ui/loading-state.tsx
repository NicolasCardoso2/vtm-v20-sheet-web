"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  variant?: "spinner" | "skeleton" | "dots"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingState({ 
  variant = "spinner", 
  size = "md", 
  text,
  className 
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-muted rounded-md h-4 w-full mb-2"></div>
        <div className="bg-muted rounded-md h-3 w-3/4 mb-2"></div>
        <div className="bg-muted rounded-md h-3 w-1/2"></div>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.4s]"></div>
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }

  // Spinner variant (default)
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "border-2 border-current border-t-transparent rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  )
}

// Empty state component for when there's no data
interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title = "Nenhum item encontrado",
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="font-medium text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}