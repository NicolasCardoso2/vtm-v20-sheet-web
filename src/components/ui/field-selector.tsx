'use client'

import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface FieldSelectorProps {
  title: string
  value?: string
  placeholder: string
  onClick: () => void
  required?: boolean
  description?: string
}

export default function FieldSelector({
  title,
  value,
  placeholder,
  onClick,
  required = false,
  description
}: FieldSelectorProps) {
  return (
    <Card 
      className="bg-black/50 border-gray-600 cursor-pointer hover:bg-black/70 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-medium">
                {title}
                {required && <span className="text-red-400">*</span>}
              </h3>
            </div>
            
            {value ? (
              <p className="text-red-300 font-medium">{value}</p>
            ) : (
              <p className="text-gray-400">{placeholder}</p>
            )}
          </div>
          
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        
        {description && value && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-gray-300 text-sm">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}