'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

interface AutoSaveProps {
  characterId: string
  data: any
  enabled?: boolean
  delay?: number
  onSave?: (success: boolean) => void
  onSaveStart?: () => void
  onSaveComplete?: () => void
  onError?: (error: Error) => void
}

// Função para salvar no localStorage como fallback
const saveToLocalStorage = (characterId: string, data: any) => {
  try {
    const key = `character_${characterId}`
    localStorage.setItem(key, JSON.stringify({
      ...data,
      updated_at: new Date().toISOString(),
      saved_offline: true
    }))
    console.log(`📱 Dados salvos localmente para o personagem ${characterId}`)
    return true
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error)
    return false
  }
}

// Função para carregar do localStorage
export const loadFromLocalStorage = (characterId: string) => {
  try {
    const key = `character_${characterId}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error)
    return null
  }
}

export function useAutoSave({ 
  characterId, 
  data, 
  enabled = true, 
  delay = 2000,
  onSave,
  onSaveStart,
  onSaveComplete,
  onError
}: AutoSaveProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastDataRef = useRef<any>(null)

  const saveData = useCallback(async (dataToSave: any) => {
    // Validações mais rigorosas
    if (!enabled || !characterId || typeof characterId !== 'string' || isSaving) {
      console.log('🔄 Auto-save ignorado:', { enabled, characterId, isSaving })
      return
    }

    try {
      setIsSaving(true)
      onSaveStart?.()

      let success = false

      if (isSupabaseConfigured()) {
        try {
          // Salvar no Supabase se estiver configurado
          const { error } = await supabase
            .from('characters')
            .update({
              ...dataToSave,
              updated_at: new Date().toISOString()
            })
            .eq('id', characterId)

          if (error) throw error
          success = true
          console.log('✅ Dados salvos no Supabase')
        } catch (supabaseError) {
          console.warn('Erro ao conectar com Supabase, usando localStorage:', supabaseError)
          // Fallback para localStorage se Supabase falhar
          success = saveToLocalStorage(characterId, dataToSave)
        }
      } else {
        // Usar localStorage como fallback
        success = saveToLocalStorage(characterId, dataToSave)
      }
      
      if (success) {
        const now = new Date()
        setLastSaved(now)
        setHasUnsavedChanges(false)
        lastDataRef.current = dataToSave
        onSave?.(true)
      } else {
        throw new Error('Falha ao salvar dados')
      }
    } catch (error) {
      const err = error as Error
      console.error('Erro no auto-save:', err)
      // Tentar salvar no localStorage como último recurso
      const fallbackSuccess = saveToLocalStorage(characterId, dataToSave)
      if (fallbackSuccess) {
        console.log('💾 Dados salvos no localStorage como fallback')
        const now = new Date()
        setLastSaved(now)
        setHasUnsavedChanges(false)
        lastDataRef.current = dataToSave
        onSave?.(true)
      } else {
        onError?.(err)
        onSave?.(false)
      }
    } finally {
      setIsSaving(false)
      onSaveComplete?.()
    }
  }, [characterId, enabled, isSaving, onSave, onSaveStart, onSaveComplete, onError])

  const debouncedSave = useCallback((dataToSave: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setHasUnsavedChanges(true)
    
    timeoutRef.current = setTimeout(() => {
      saveData(dataToSave)
    }, delay)
  }, [saveData, delay])

  // Force save without debounce
  const forceSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (data) {
      saveData(data)
    }
  }, [saveData, data])

  useEffect(() => {
    if (data && enabled && characterId && typeof characterId === 'string') {
      // Check if data actually changed
      const currentDataStr = JSON.stringify(data)
      const lastDataStr = JSON.stringify(lastDataRef.current)
      
      if (currentDataStr !== lastDataStr) {
        console.log('📝 Dados alterados, iniciando auto-save...')
        debouncedSave(data)
      } else {
        console.log('📋 Dados inalterados, pulando auto-save')
      }
    }
  }, [data, debouncedSave, enabled, characterId])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { 
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    forceSave
  }
}