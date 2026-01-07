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
        "bg-black/50 border border-red-800/30 rounded-lg transition-all duration-200",
        "hover:border-red-700/50 focus-within:ring-2 focus-within:ring-red-500/20",
        selected && "border-red-500 bg-red-950/30 shadow-sm shadow-red-900/20",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:shadow-sm hover:shadow-red-900/10",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-white leading-tight transition-colors duration-150",
                selected && "text-red-300",
                disabled && "text-gray-500"
              )}>
                {title}
              </h3>
              {description && !expanded && (
                <p className="text-sm text-red-200/70 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-red-900/50 text-red-200 border border-red-800/30"
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
                "text-red-300 hover:text-red-100 hover:bg-red-900/30",
                "focus:ring-2 focus:ring-red-500/20 focus:outline-none"
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
                "focus:ring-2 focus:ring-red-500/20 focus:outline-none",
                "border-red-800/50 text-white hover:bg-red-900/30",
                selected && "bg-red-900/50 text-red-200 hover:bg-red-900/70 border-red-600",
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
        <div className="border-t border-red-800/30 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-red-950/20">
            {description && (
              <p className="text-sm text-red-200/80 leading-relaxed mb-4">
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