'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, WifiOff, AlertTriangle, Save } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase/client'

interface AutoSaveStatusProps {
  isSaving?: boolean
  lastSaved?: Date | null
  hasUnsavedChanges?: boolean
  className?: string
}

export function AutoSaveStatus({ 
  isSaving = false, 
  lastSaved = null, 
  hasUnsavedChanges = false,
  className = ''
}: AutoSaveStatusProps) {
  const [isOffline, setIsOffline] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsOffline(!isSupabaseConfigured())
  }, [])

  // Não renderizar no servidor para evitar hidration mismatch
  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="gap-2">
          <Clock className="w-3 h-3" />
          Carregando...
        </Badge>
      </div>
    )
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'há poucos segundos'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `há ${minutes} minuto${minutes !== 1 ? 's' : ''}`
    } else {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const getStatusBadge = () => {
    if (isSaving) {
      return (
        <Badge variant="secondary" className="gap-2">
          <Save className="w-3 h-3 animate-pulse" />
          Salvando...
        </Badge>
      )
    }

    if (hasUnsavedChanges) {
      return (
        <Badge variant="secondary" className="gap-2">
          <Clock className="w-3 h-3" />
          Alterações não salvas
        </Badge>
      )
    }

    if (lastSaved) {
      return (
        <Badge variant="secondary" className="gap-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          Salvo {formatLastSaved(lastSaved)}
        </Badge>
      )
    }

    return null
  }

  const getOfflineBadge = () => {
    if (isOffline) {
      return (
        <Badge variant="outline" className="gap-2 text-orange-600 border-orange-200 bg-orange-50">
          <WifiOff className="w-3 h-3" />
          Modo Offline
        </Badge>
      )
    }
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getOfflineBadge()}
      {getStatusBadge()}
    </div>
  )
}

interface OfflineModeWarningProps {
  className?: string
}

export function OfflineModeWarning({ className = '' }: OfflineModeWarningProps) {
  const [isOffline, setIsOffline] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsOffline(!isSupabaseConfigured())
  }, [])

  // Não renderizar no servidor
  if (!isClient || !isOffline) return null

  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-orange-800">
            Modo de Desenvolvimento Offline
          </p>
          <p className="text-xs text-orange-700">
            Os dados estão sendo salvos localmente. Para usar o sistema completo com sincronização na nuvem, 
            configure o arquivo <code className="bg-orange-100 px-1 rounded">.env.local</code> com suas credenciais do Supabase.
          </p>
          <details className="text-xs text-orange-600">
            <summary className="cursor-pointer hover:text-orange-800">
              Como configurar?
            </summary>
            <div className="mt-2 space-y-1">
              <p>1. Copie o arquivo <code>.env.local.example</code> para <code>.env.local</code></p>
              <p>2. Substitua as URLs placeholder pelas suas credenciais do Supabase</p>
              <p>3. Reinicie o servidor de desenvolvimento</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}