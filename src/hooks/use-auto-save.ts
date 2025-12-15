'use client'

import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { debounce } from 'lodash'

interface AutoSaveProps {
  characterId: string
  data: any
  enabled?: boolean
  onSave?: (success: boolean) => void
}

export function useAutoSave({ characterId, data, enabled = true, onSave }: AutoSaveProps) {
  const saveData = useCallback(
    debounce(async (dataToSave: any) => {
      if (!enabled || !characterId) return

      try {
        const { error } = await supabase
          .from('characters')
          .update({
            ...dataToSave,
            updated_at: new Date().toISOString()
          })
          .eq('id', characterId)

        if (error) throw error
        
        onSave?.(true)
      } catch (error) {
        console.error('Erro no auto-save:', error)
        onSave?.(false)
      }
    }, 2000), // Salva após 2 segundos de inatividade
    [characterId, enabled, onSave]
  )

  useEffect(() => {
    if (data && enabled) {
      saveData(data)
    }
  }, [data, saveData, enabled])

  return { saveData }
}