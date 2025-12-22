'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface AccordionItemProps {
  id: string
  title: string
  description?: string
  tags?: string[]
  expanded?: boolean
  selected?: boolean
  disabled?: boolean
  loading?: boolean
  onToggle?: () => void
  onSelect?: () => void
  className?: string
  children?: React.ReactNode
}

export function AccordionItem({
  id,
  title,
  description,
  tags = [],
  expanded = false,
  selected = false,
  disabled = false,
  loading = false,
  onToggle,
  onSelect,
  className,
  children
}: AccordionItemProps) {
  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-lg transition-all duration-200",
        "hover:border-border/80 focus-within:ring-2 focus-within:ring-primary/20",
        selected && "border-primary bg-primary/5 shadow-sm",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-foreground leading-tight transition-colors duration-150",
                selected && "text-primary",
                disabled && "text-muted-foreground"
              )}>
                {title}
              </h3>
              {description && !expanded && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {description}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              disabled={disabled}
              className={cn(
                "p-1 h-8 w-8 transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                "focus:ring-2 focus:ring-primary/20 focus:outline-none"
              )}
              aria-label={expanded ? "Recolher" : "Expandir"}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          {onSelect && (
            <Button
              onClick={onSelect}
              size="sm"
              variant={selected ? "secondary" : "default"}
              disabled={disabled || loading}
              className={cn(
                "text-sm font-medium min-w-[80px] transition-all duration-200",
                "focus:ring-2 focus:ring-primary/20 focus:outline-none",
                selected && "bg-primary/10 text-primary hover:bg-primary/20",
                loading && "cursor-wait"
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  <span>...</span>
                </div>
              ) : selected ? (
                "Selecionado"
              ) : (
                "Escolher"
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-muted/20">
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      )}
    </div>
  )
}