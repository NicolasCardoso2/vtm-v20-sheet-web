import { TraitItem } from '@/types/traits'

/**
 * Carrega e normaliza o dataset de qualidades e defeitos
 */
export async function loadTraitsDataset(): Promise<TraitItem[]> {
  try {
    const response = await fetch('/qualidades_defeitos_dataset.json')
    const data = await response.json()
    
    return data.itens.map((item: any): TraitItem => ({
      id: item.id,
      nome: item.nome,
      tipo: item.tipo as 'qualidade' | 'defeito',
      categoria: mapCategoria(item.categoria),
      custo: item.custo,
      restricoes: item.restricoes || [],
      clan: extractClan(item.restricoes),
      descricao: item.descricao || '',
      goldQuality: item.goldQuality || false,
      ancillaeOnly: item.ancillaeOnly || false
    }))
  } catch (error) {
    console.error('Erro ao carregar dataset de traits:', error)
    throw new Error('Falha ao carregar qualidades e defeitos')
  }
}

/**
 * Mapeia categorias do dataset para o enum padrão
 */
function mapCategoria(categoria: string): 'fisico' | 'mental' | 'social' | 'sobrenatural' {
  const normalized = categoria.toLowerCase()
  
  // Mapear formatos variados
  if (normalized.includes('físic') || normalized.includes('fisic') || normalized === 'fisico') return 'fisico'
  if (normalized.includes('mental') || normalized.includes('mentais') || normalized === 'mental') return 'mental'
  if (normalized.includes('social') || normalized.includes('sociais') || normalized === 'social') return 'social'
  if (normalized.includes('sobrenatural') || normalized.includes('sobrenaturais') || normalized === 'sobrenatural') return 'sobrenatural'
  
  // Log para debug se não conseguir mapear
  console.warn('Categoria não mapeada:', categoria)
  
  // Default para físico se não conseguir mapear
  return 'fisico'
}

/**
 * Extrai informação de clã das restrições
 */
function extractClan(restricoes?: string[]): string | undefined {
  if (!restricoes) return undefined
  
  for (const restricao of restricoes) {
    const clanMatch = restricao.match(/Clã:\s*([^,\]]+)/i)
    if (clanMatch) {
      return clanMatch[1].trim()
    }
    
    // Outros padrões de clã
    if (restricao.includes('Malkaviano')) return 'Malkaviano'
    if (restricao.includes('Nosferatu')) return 'Nosferatu'
    if (restricao.includes('Tremere')) return 'Tremere'
    if (restricao.includes('Tzimisce')) return 'Tzimisce'
    if (restricao.includes('Brujah')) return 'Brujah'
    if (restricao.includes('Lasombra')) return 'Lasombra'
    if (restricao.includes('Giovanni')) return 'Giovanni'
    if (restricao.includes('Ventrue')) return 'Ventrue'
    if (restricao.includes('Assamita')) return 'Assamita'
  }
  
  return undefined
}

/**
 * Obtém lista única de clãs do dataset
 */
export function getAvailableClans(items: TraitItem[]): string[] {
  const clans = new Set<string>()
  
  items.forEach(item => {
    if (item.clan) {
      clans.add(item.clan)
    }
  })
  
  return Array.from(clans).sort()
}