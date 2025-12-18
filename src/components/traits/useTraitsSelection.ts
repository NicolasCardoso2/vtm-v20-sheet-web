'use client'

import { useState, useCallback, useEffect } from 'react'
import { SelectedTrait } from '@/types/traits'

interface UseTraitsSelectionOptions {
  storageKey?: string
  initialSelection?: SelectedTrait[]
}

export function useTraitsSelection(options: UseTraitsSelectionOptions = {}) {
  const { storageKey = 'sheet:traits', initialSelection = [] } = options
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>(initialSelection)

  // Carregar do localStorage na inicialização
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setSelectedTraits(parsed)
        } catch (error) {
          console.warn('Erro ao carregar traits do localStorage:', error)
        }
      }
    }
  }, [storageKey])

  // Salvar no localStorage quando houver mudanças
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(selectedTraits))
    }
  }, [selectedTraits, storageKey])

  const addTrait = useCallback((trait: SelectedTrait) => {
    setSelectedTraits(prev => {
      // Verificar se já existe
      const exists = prev.find(t => t.itemId === trait.itemId)
      if (exists) {
        console.warn(`Trait ${trait.itemId} já foi selecionado`)
        return prev
      }
      return [...prev, trait]
    })
  }, [])

  const removeTrait = useCallback((itemId: string) => {
    setSelectedTraits(prev => prev.filter(t => t.itemId !== itemId))
  }, [])

  const updateChosenPoints = useCallback((itemId: string, chosenPoints: number) => {
    setSelectedTraits(prev => 
      prev.map(t => 
        t.itemId === itemId 
          ? { ...t, chosenPoints }
          : t
      )
    )
  }, [])

  const updateNotes = useCallback((itemId: string, notes: string) => {
    setSelectedTraits(prev =>
      prev.map(t =>
        t.itemId === itemId
          ? { ...t, notes: notes || undefined }
          : t
      )
    )
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedTraits([])
  }, [])

  const isSelected = useCallback((itemId: string) => {
    return selectedTraits.some(t => t.itemId === itemId)
  }, [selectedTraits])

  const getSelectedTrait = useCallback((itemId: string) => {
    return selectedTraits.find(t => t.itemId === itemId)
  }, [selectedTraits])

  const setInitialSelection = useCallback((traits: SelectedTrait[]) => {
    setSelectedTraits(traits)
  }, [])

  return {
    selectedTraits,
    addTrait,
    removeTrait,
    updateChosenPoints,
    updateNotes,
    clearSelection,
    isSelected,
    getSelectedTrait,
    setInitialSelection
  }
}