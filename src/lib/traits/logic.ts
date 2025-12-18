import { TraitItem, SelectedTrait, TraitTotals, TraitValidationResult, ResolvedPoints } from '@/types/traits'

/**
 * Resolve os pontos de um item para determinar se é fixo, range ou opções
 */
export function resolvePoints(item: TraitItem): ResolvedPoints {
  const { custo } = item

  // Se tem opções, é tipo options
  if (custo.opcoes && custo.opcoes.length > 0) {
    return {
      kind: 'options',
      options: custo.opcoes
    }
  }

  // Se tem mínimo e máximo, é range
  if (custo.minimo !== undefined && custo.maximo !== undefined) {
    return {
      kind: 'range',
      min: custo.minimo,
      max: custo.maximo
    }
  }

  // Valor fixo
  const value = custo.valor || 0
  return {
    kind: 'fixed',
    value: Math.abs(value) // Sempre positivo para consistência
  }
}

/**
 * Normaliza os pontos escolhidos garantindo que defeitos sejam tratados como magnitude positiva
 */
export function normalizeChosenPoints(item: TraitItem, chosenPoints: number): number {
  const resolved = resolvePoints(item)
  
  // Validar se o valor está dentro das opções/range permitido
  if (resolved.kind === 'options' && resolved.options) {
    if (!resolved.options.map(Math.abs).includes(Math.abs(chosenPoints))) {
      throw new Error(`Valor ${chosenPoints} não está nas opções permitidas para ${item.nome}`)
    }
  } else if (resolved.kind === 'range' && resolved.min !== undefined && resolved.max !== undefined) {
    const absChoice = Math.abs(chosenPoints)
    const absMin = Math.abs(resolved.min)
    const absMax = Math.abs(resolved.max)
    if (absChoice < absMin || absChoice > absMax) {
      throw new Error(`Valor ${chosenPoints} fora do range ${absMin}-${absMax} para ${item.nome}`)
    }
  } else if (resolved.kind === 'fixed' && resolved.value !== undefined) {
    if (Math.abs(chosenPoints) !== resolved.value) {
      throw new Error(`Valor ${chosenPoints} não corresponde ao valor fixo ${resolved.value} para ${item.nome}`)
    }
  }

  // Retornar sempre magnitude positiva
  return Math.abs(chosenPoints)
}

/**
 * Calcula os totais de qualidades e defeitos
 */
export function calculateTotals(
  selectedTraits: SelectedTrait[], 
  allItems: TraitItem[]
): TraitTotals {
  let totalQualidades = 0
  let totalDefeitos = 0

  selectedTraits.forEach(selected => {
    const item = allItems.find(i => i.id === selected.itemId)
    if (!item) return

    const normalizedPoints = normalizeChosenPoints(item, selected.chosenPoints)

    if (item.tipo === 'qualidade') {
      totalQualidades += normalizedPoints
    } else if (item.tipo === 'defeito') {
      totalDefeitos += normalizedPoints
    }
  })

  return {
    totalQualidades,
    totalDefeitos,
    remainingQualidades: Math.max(0, 7 - totalQualidades),
    remainingDefeitos: Math.max(0, 7 - totalDefeitos)
  }
}

/**
 * Valida a seleção atual de qualidades e defeitos
 */
export function validateSelection(
  selectedTraits: SelectedTrait[],
  allItems: TraitItem[]
): TraitValidationResult {
  const errors: string[] = []
  const itemIds = new Set<string>()

  // Verificar duplicados
  selectedTraits.forEach(selected => {
    if (itemIds.has(selected.itemId)) {
      const item = allItems.find(i => i.id === selected.itemId)
      errors.push(`${item?.nome || 'Item'} já foi selecionado`)
      return
    }
    itemIds.add(selected.itemId)

    // Verificar se item existe
    const item = allItems.find(i => i.id === selected.itemId)
    if (!item) {
      errors.push(`Item com ID ${selected.itemId} não encontrado no dataset`)
      return
    }

    // Validar pontos escolhidos
    try {
      normalizeChosenPoints(item, selected.chosenPoints)
    } catch (error) {
      errors.push(error.message)
    }
  })

  const totals = calculateTotals(selectedTraits, allItems)

  // Validar limites de pontos silenciosamente
  // A validação visual já é feita na interface

  const isValid = errors.length === 0 && totals.totalQualidades <= 7 && totals.totalDefeitos === 7

  return {
    isValid,
    errors,
    totals
  }
}