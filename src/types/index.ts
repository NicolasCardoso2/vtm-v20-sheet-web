export interface Chronicle {
  id: string
  name: string
  storyteller_user_id: string
  settings_json: ChronicleSettings
  created_at: string
  updated_at: string
}

export interface ChronicleSettings {
  // Configurações de clãs permitidos
  allowedClans: string[]
  
  // Configurações de geração padrão
  defaultGeneration: number
  maxGeneration: number
  minGeneration: number
  
  // Pontos iniciais configuráveis
  initialPoints: {
    physicalAttributes: number
    socialAttributes: number
    mentalAttributes: number
    skills: number
    disciplines: number
    backgrounds: number
    virtues: number
    freebie: number
  }
  
  // Limites e regras
  limits: {
    maxAttributeAtCreation: number
    maxSkillAtCreation: number
    maxDisciplineAtCreation: number
    maxBackgroundAtCreation: number
  }
  
  // House rules customizáveis
  houseRules: {
    useExtendedVirtues: boolean
    allowCustomClans: boolean
    requireApproval: boolean
    allowSelfApproval: boolean
  }
  
  // Campos obrigatórios
  requiredFields: string[]
  
  // Configurações de XP
  experienceRules: {
    attributeCost: number[]
    skillCost: number[]
    disciplineCost: number[]
    backgroundCost: number[]
    virtueCost: number[]
  }
}

export interface Character {
  id: string
  chronicle_id: string
  owner_user_id: string
  
  // Dados de identidade
  name: string
  concept: string
  clan: string
  nature: string
  demeanor: string
  generation: number
  sire: string
  
  // JSONs estruturados
  attributes_json: CharacterAttributes
  skills_json: CharacterSkills
  advantages_json: CharacterAdvantages
  morality_json: CharacterMorality
  
  // Status e metadados
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  approval_notes: string
  experience_points: number
  experience_total: number
  
  // Timestamps
  created_at: string
  updated_at: string
  approved_at?: string
}

export interface CharacterAttributes {
  physical: {
    strength: number
    dexterity: number
    stamina: number
  }
  social: {
    charisma: number
    manipulation: number
    appearance: number
  }
  mental: {
    perception: number
    intelligence: number
    wits: number
  }
}

export interface CharacterSkills {
  talents: Record<string, number>
  skills: Record<string, number>
  knowledges: Record<string, number>
  specializations: Record<string, string[]>
}

export interface CharacterAdvantages {
  disciplines: Record<string, number>
  backgrounds: Record<string, number>
  virtues: {
    conscience: number
    self_control: number
    courage: number
  }
  merits: Record<string, number>
  flaws: Record<string, number>
}

export interface CharacterMorality {
  path: string // 'humanity' ou nome da trilha
  rating: number
  willpower: {
    permanent: number
    temporary: number
  }
  blood_pool: {
    current: number
    per_turn: number
  }
  health_levels: {
    bruised: boolean
    hurt: boolean
    injured: boolean
    wounded: boolean
    mauled: boolean
    crippled: boolean
    incapacitated: boolean
  }
}

export interface CharacterChangeLog {
  id: string
  character_id: string
  change_type: 'creation' | 'experience' | 'approval' | 'edit'
  diff_json: Record<string, any>
  notes: string
  created_at: string
  created_by: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'player' | 'storyteller' | 'admin'
  created_at: string
}

// Tipos para o wizard de criação
export interface WizardStep {
  id: number
  title: string
  description: string
  completed: boolean
  valid: boolean
}

export interface ValidationResult {
  isValid: boolean
  warnings: string[]
  errors: string[]
  pointsSpent: Record<string, number>
  pointsAvailable: Record<string, number>
}