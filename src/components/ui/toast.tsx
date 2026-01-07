'use client'

import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  title: string
  message?: string
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

const toastStyles = {
  success: {
    container: 'border-green-200 bg-green-50 text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-800',
    icon: AlertCircle,
    iconColor: 'text-red-600'
  },
  warning: {
    container: 'border-orange-200 bg-orange-50 text-orange-800',
    icon: AlertTriangle,
    iconColor: 'text-orange-600'
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-blue-800',
    icon: Info,
    iconColor: 'text-blue-600'
  }
}

export default function Toast({ 
  type, 
  title, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const styles = toastStyles[type]
  const IconComponent = styles.icon

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  // Auto-close after duration
  if (autoClose) {
    setTimeout(() => {
      if (isVisible) {
        handleClose()
      }
    }, duration)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-lg transition-all duration-300 ${styles.container}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.iconColor}`} />
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          {message && (
            <p className="text-sm mt-1 opacity-90">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Hook para gerenciar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    }
    
    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, message?: string) => 
    showToast({ type: 'success', title, message })
    
  const showError = (title: string, message?: string) => 
    showToast({ type: 'error', title, message })
    
  const showWarning = (title: string, message?: string) => 
    showToast({ type: 'warning', title, message })
    
  const showInfo = (title: string, message?: string) => 
    showToast({ type: 'info', title, message })

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}