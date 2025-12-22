// Tipos para os dados do sistema
import { Character } from './index'

// Tipos para Qualidades e Defeitos
export interface TraitItem {
  id: string
  name: string
  type: 'qualidade' | 'defeito'
  category: 'fisico' | 'mental' | 'social' | 'sobrenatural'
  points: number | { min: number; max: number }
  clan?: string
  description: string
  goldQuality?: boolean // Para qualidades Gold
  ancillaeOnly?: boolean // Para cargos de ancillae
}

export interface SelectedTrait {
  itemId: string
  chosenPoints: number
  notes?: string
}

export interface TraitTotals {
  totalQualidades: number
  totalDefeitos: number
  remainingQualidades: number
  remainingDefeitos: number
}

export interface TraitValidationResult {
  isValid: boolean
  errors: string[]
  totals: TraitTotals
}

export interface Clan {
  id: string
  nome: string
  resumo: string
  descricao: string
  disciplinas?: string[]
  tags?: string[]
}

export interface Jeito {
  id: string
  nome: string
  resumo: string
  descricao: string
}

export interface Arquetipo {
  id: string
  tipo: 'NATUREZA' | 'COMPORTAMENTO' | 'AMBOS'
  nome: string
  resumo: string
  descricao: string
}

// Props para componentes de seleção
export interface SelectorProps {
  title: string
  value?: string
  placeholder: string
  onSelect: (item: any) => void
  required?: boolean
}

export interface ModalSelectorProps {
  isOpen: boolean
  onClose: () => void
  title: string
  items: any[]
  onSelect: (item: any) => void
  searchPlaceholder?: string
}

// Dados expandidos do personagem
export interface CharacterDraft extends Partial<Character> {
  // Etapa 1 - Origem
  jeito?: Jeito
  
  // Etapa 2 - Conceito  
  natureza?: Arquetipo
  comportamento?: Arquetipo
  senhor?: string
  
  // Qualidades e Defeitos - novo sistema unificado
  qualidadesEDefeitos?: SelectedTrait[]
  
  // Mantido para compatibilidade (deprecated)
  qualidades?: SelectedTrait[]
  defeitos?: SelectedTrait[]
}