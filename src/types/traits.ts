// Tipos para o sistema de Qualidades e Defeitos
export type TraitType = 'qualidade' | 'defeito'
export type TraitCategory = 'fisico' | 'mental' | 'social' | 'sobrenatural'

export type TraitPoints = 
  | number 
  | { min: number; max: number } 
  | { options: number[] }

export interface TraitItem {
  id: string
  nome: string
  tipo: TraitType
  categoria: TraitCategory
  custo: {
    valor?: number
    minimo?: number
    maximo?: number
    opcoes?: number[]
  }
  restricoes?: string[]
  clan?: string
  descricao: string
  goldQuality?: boolean
  ancillaeOnly?: boolean
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

export interface ResolvedPoints {
  kind: 'fixed' | 'range' | 'options'
  value?: number
  min?: number
  max?: number
  options?: number[]
}

export interface TraitFilter {
  search?: string
  categoria?: TraitCategory | 'all'
}