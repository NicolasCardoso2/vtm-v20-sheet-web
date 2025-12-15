// Tipos para os dados do sistema
import { Character } from './index'
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
}