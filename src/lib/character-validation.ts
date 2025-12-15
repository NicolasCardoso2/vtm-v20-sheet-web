import { CharacterAttributes, CharacterSkills, CharacterAdvantages, CharacterMorality, ValidationResult } from '@/types'

export const DEFAULT_CLANS = [
  'Brujah', 'Gangrel', 'Malkaviano', 'Nosferatu', 'Toreador', 'Tremere', 'Ventrue',
  'Caitiff', 'Assamita', 'Seguidor de Set', 'Giovanni', 'Lasombra', 'Tzimisce'
]

export const DEFAULT_NATURES = [
  'Arquiteto', 'Autocrata', 'Bon Vivant', 'Bravo', 'Caçador de Emoções', 'Cavaleiro',
  'Competidor', 'Confabulador', 'Conformista', 'Criança', 'Curandeiro', 'Diretor',
  'Fanático', 'Galante', 'Idealista', 'Juiz', 'Loner', 'Maquiavélico', 'Mártir',
  'Masoquista', 'Monstro', 'Pedagogo', 'Penitente', 'Perfeccionista', 'Rebelde',
  'Rogue', 'Sobrevivente', 'Tradicionalista', 'Visionário'
]

export const DEFAULT_ATTRIBUTES = {
  physical: { strength: 1, dexterity: 1, stamina: 1 },
  social: { charisma: 1, manipulation: 1, appearance: 1 },
  mental: { perception: 1, intelligence: 1, wits: 1 }
}

export const DEFAULT_SKILLS = {
  talents: {
    'Prontidão': 0, 'Esportes': 0, 'Briga': 0, 'Esquiva': 0, 'Empatia': 0,
    'Expressão': 0, 'Intimidação': 0, 'Liderança': 0, 'Manha': 0, 'Lábia': 0
  },
  skills: {
    'Empatia com Animais': 0, 'Ofícios': 0, 'Condução': 0, 'Etiqueta': 0, 'Armas de Fogo': 0,
    'Armas Brancas': 0, 'Música': 0, 'Reparos': 0, 'Segurança': 0, 'Furtividade': 0, 'Sobrevivência': 0
  },
  knowledges: {
    'Acadêmicos': 0, 'Ciências': 0, 'Computador': 0, 'Finanças': 0, 'Investigação': 0,
    'Direito': 0, 'Linguística': 0, 'Medicina': 0, 'Ocultismo': 0, 'Política': 0
  },
  specializations: {}
}

export const DEFAULT_DISCIPLINES = [
  'Animalismo', 'Auspícios', 'Celeridade', 'Demência', 'Dominação', 'Fortitude',
  'Metamorfose', 'Necromancia', 'Obscurecimento', 'Potência', 'Presença',
  'Proteano', 'Quietus', 'Serpentis', 'Taumaturgia', 'Tenebrosidade', 'Vicissitude'
]

export const DEFAULT_BACKGROUNDS = [
  'Aliados', 'Contatos', 'Fama', 'Geração', 'Rebanho', 'Influência',
  'Mentor', 'Recursos', 'Lacaios', 'Status'
]

export function validateCharacter(
  attributes: CharacterAttributes,
  skills: CharacterSkills,
  advantages: CharacterAdvantages,
  morality: CharacterMorality,
  chronicleSettings: any
): ValidationResult {
  const warnings: string[] = []
  const errors: string[] = []
  const pointsSpent = {
    attributes: 0, // Mantido para compatibilidade
    physicalAttributes: 0,
    socialAttributes: 0,
    mentalAttributes: 0,
    skills: 0,
    disciplines: 0,
    backgrounds: 0,
    virtues: 0
  }
  const pointsAvailable = chronicleSettings.initialPoints

  // Calcular pontos gastos em atributos por categoria (começam em 1, então -3 para cada categoria)
  const physicalSpent = (attributes.physical.strength + attributes.physical.dexterity + attributes.physical.stamina) - 3
  const socialSpent = (attributes.social.charisma + attributes.social.manipulation + attributes.social.appearance) - 3
  const mentalSpent = (attributes.mental.perception + attributes.mental.intelligence + attributes.mental.wits) - 3
  pointsSpent.attributes = physicalSpent + socialSpent + mentalSpent // Compatibilidade com sistemas existentes
  pointsSpent.physicalAttributes = physicalSpent
  pointsSpent.socialAttributes = socialSpent  
  pointsSpent.mentalAttributes = mentalSpent

  // Calcular pontos gastos em habilidades
  pointsSpent.skills = Object.values({
    ...skills.talents,
    ...skills.skills,
    ...skills.knowledges
  }).reduce((total, level) => total + level, 0)

  // Calcular pontos gastos em disciplinas
  pointsSpent.disciplines = Object.values(advantages.disciplines)
    .reduce((total, level) => total + level, 0)

  // Calcular pontos gastos em antecedentes
  pointsSpent.backgrounds = Object.values(advantages.backgrounds)
    .reduce((total, level) => total + level, 0)

  // Calcular pontos gastos em virtudes (começam em 1, então -3)
  pointsSpent.virtues = (advantages.virtues.conscience + advantages.virtues.self_control + advantages.virtues.courage) - 3

  // Validações por categoria de atributos
  if (pointsSpent.physicalAttributes > pointsAvailable.physicalAttributes) {
    errors.push(`Pontos de atributos físicos excedidos: ${pointsSpent.physicalAttributes}/${pointsAvailable.physicalAttributes}`)
  }

  if (pointsSpent.socialAttributes > pointsAvailable.socialAttributes) {
    errors.push(`Pontos de atributos sociais excedidos: ${pointsSpent.socialAttributes}/${pointsAvailable.socialAttributes}`)
  }

  if (pointsSpent.mentalAttributes > pointsAvailable.mentalAttributes) {
    errors.push(`Pontos de atributos mentais excedidos: ${pointsSpent.mentalAttributes}/${pointsAvailable.mentalAttributes}`)
  }

  if (pointsSpent.skills > pointsAvailable.skills) {
    errors.push(`Pontos de habilidades excedidos: ${pointsSpent.skills}/${pointsAvailable.skills}`)
  }

  if (pointsSpent.disciplines > pointsAvailable.disciplines) {
    errors.push(`Pontos de disciplinas excedidos: ${pointsSpent.disciplines}/${pointsAvailable.disciplines}`)
  }

  if (pointsSpent.backgrounds > pointsAvailable.backgrounds) {
    errors.push(`Pontos de antecedentes excedidos: ${pointsSpent.backgrounds}/${pointsAvailable.backgrounds}`)
  }

  if (pointsSpent.virtues > pointsAvailable.virtues) {
    errors.push(`Pontos de virtudes excedidos: ${pointsSpent.virtues}/${pointsAvailable.virtues}`)
  }

  // Verificar limites máximos
  const maxAttr = chronicleSettings.limits.maxAttributeAtCreation
  Object.entries(attributes).forEach(([category, attrs]) => {
    Object.entries(attrs).forEach(([attr, value]) => {
      if (value > maxAttr) {
        errors.push(`${attr} não pode ser maior que ${maxAttr} na criação`)
      }
    })
  })

  const maxSkill = chronicleSettings.limits.maxSkillAtCreation
  Object.entries({...skills.talents, ...skills.skills, ...skills.knowledges}).forEach(([skill, value]) => {
    if (value > maxSkill) {
      errors.push(`${skill} não pode ser maior que ${maxSkill} na criação`)
    }
  })

  // Avisos para pontos não gastos por categoria
  if (pointsSpent.physicalAttributes < pointsAvailable.physicalAttributes) {
    warnings.push(`${pointsAvailable.physicalAttributes - pointsSpent.physicalAttributes} pontos de atributos físicos não gastos`)
  }

  if (pointsSpent.socialAttributes < pointsAvailable.socialAttributes) {
    warnings.push(`${pointsAvailable.socialAttributes - pointsSpent.socialAttributes} pontos de atributos sociais não gastos`)
  }

  if (pointsSpent.mentalAttributes < pointsAvailable.mentalAttributes) {
    warnings.push(`${pointsAvailable.mentalAttributes - pointsSpent.mentalAttributes} pontos de atributos mentais não gastos`)
  }

  if (pointsSpent.skills < pointsAvailable.skills) {
    warnings.push(`${pointsAvailable.skills - pointsSpent.skills} pontos de habilidades não gastos`)
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
    pointsSpent,
    pointsAvailable
  }
}