'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, X, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TraitItem, SelectedTrait, TraitFilter } from '@/types/traits'
import { useTraitsSelection } from './useTraitsSelection'
import { loadTraitsDataset, getAvailableClans } from '@/lib/traits/loadDataset'
import { resolvePoints, validateSelection, calculateTotals } from '@/lib/traits/logic'
import { clsx } from 'clsx'

interface TraitsModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (selectedTraits: SelectedTrait[]) => void
  initialSelection?: SelectedTrait[]
}

export function TraitsModal({ open, onClose, onConfirm, initialSelection = [] }: TraitsModalProps) {
  const [allTraits, setAllTraits] = useState<TraitItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<TraitFilter>({ categoria: 'all' })
  const [activeTab, setActiveTab] = useState<'qualidades' | 'defeitos'>('qualidades')

  const {
    selectedTraits,
    addTrait,
    removeTrait,
    updateChosenPoints,
    clearSelection,
    isSelected,
    getSelectedTrait,
    setInitialSelection
  } = useTraitsSelection()

  // Carregar dados na abertura do modal
  useEffect(() => {
    if (open) {
      loadData()
      setInitialSelection(initialSelection)
    }
  }, [open, initialSelection, setInitialSelection])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await loadTraitsDataset()
      setAllTraits(data)
    } catch (err) {
      setError('Erro ao carregar qualidades e defeitos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar traits
  const filteredTraits = useMemo(() => {
    return allTraits.filter(trait => {
      const matchesType = trait.tipo === activeTab.slice(0, -1) // 'qualidades' -> 'qualidade'
      const matchesSearch = !filter.search || 
        trait.nome.toLowerCase().includes(filter.search.toLowerCase()) ||
        trait.descricao.toLowerCase().includes(filter.search.toLowerCase())
      const matchesCategory = filter.categoria === 'all' || trait.categoria === filter.categoria
      return matchesType && matchesSearch && matchesCategory
    })
  }, [allTraits, activeTab, filter])

  // Calcular totais
  const totals = useMemo(() => {
    return calculateTotals(selectedTraits, allTraits)
  }, [selectedTraits, allTraits])

  // Validar seleção
  const validation = useMemo(() => {
    return validateSelection(selectedTraits, allTraits)
  }, [selectedTraits, allTraits])

  // Clãs disponíveis
  const availableClans = useMemo(() => {
    return getAvailableClans(allTraits)
  }, [allTraits])

  const handleTraitClick = (trait: TraitItem) => {
    const resolved = resolvePoints(trait)
    
    if (isSelected(trait.id)) {
      removeTrait(trait.id)
      return
    }

    if (resolved.kind === 'fixed' && resolved.value !== undefined) {
      // Adicionar direto com valor fixo
      addTrait({
        itemId: trait.id,
        chosenPoints: trait.tipo === 'defeito' ? -resolved.value : resolved.value
      })
    }
    // Para range e options, será tratado no PointSelector
  }

  const handleConfirm = () => {
    if (validation.isValid) {
      onConfirm(selectedTraits)
      onClose()
    }
  }

  const handleCancel = () => {
    clearSelection()
    onClose()
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2">Carregando qualidades e defeitos...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={onClose} className="mt-4">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 via-red-950/20 to-black border-red-900/50">
        <DialogHeader className="pb-6 border-b border-red-900/30">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-200 to-red-400 bg-clip-text text-transparent">
                Qualidades e Defeitos
              </DialogTitle>
              <p className="text-sm text-red-300/70 mt-1">
                Selecione até 7 pontos de qualidades e exatamente 7 pontos de defeitos
              </p>
            </div>
            
            {/* Contador de seleção */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className={clsx(
                  "text-2xl font-bold",
                  totals.totalQualidades > 7 ? "text-red-400" : "text-emerald-400"
                )}>
                  {totals.totalQualidades}
                </div>
                <div className="text-xs text-emerald-300/70">Qualidades</div>
              </div>
              <div className="w-px bg-red-900/50 mx-2"></div>
              <div className="text-center">
                <div className={clsx(
                  "text-2xl font-bold",
                  totals.totalDefeitos !== 7 ? "text-red-400" : "text-emerald-400"
                )}>
                  {totals.totalDefeitos}
                </div>
                <div className="text-xs text-red-300/70">Defeitos</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Barra de progresso visual */}
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-300">Qualidades</span>
              <span className={totals.totalQualidades > 7 ? "text-red-400" : "text-emerald-400"}>
                {totals.totalQualidades}/7
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={clsx(
                  "h-full transition-all duration-300 rounded-full",
                  totals.totalQualidades > 7 
                    ? "bg-gradient-to-r from-red-500 to-red-600" 
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                )}
                style={{ width: `${Math.min((totals.totalQualidades / 7) * 100, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-red-300">Defeitos</span>
              <span className={totals.totalDefeitos !== 7 ? "text-red-400" : "text-emerald-400"}>
                {totals.totalDefeitos}/7
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={clsx(
                  "h-full transition-all duration-300 rounded-full",
                  totals.totalDefeitos !== 7 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600" 
                    : "bg-gradient-to-r from-emerald-500 to-emerald-600"
                )}
                style={{ width: `${(totals.totalDefeitos / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alertas de validação */}
        {validation.errors.length > 0 && (
          <div className="bg-red-950/30 border border-red-500/50 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {validation.errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-300">{error}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as 'qualidades' | 'defeitos')} 
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <TabsList className="grid w-80 grid-cols-2 bg-gray-800/50">
              <TabsTrigger 
                value="qualidades" 
                className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-300 data-[state=active]:border-emerald-500/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Qualidades
              </TabsTrigger>
              <TabsTrigger 
                value="defeitos"
                className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-300 data-[state=active]:border-red-500/50"
              >
                <Minus className="h-4 w-4 mr-2" />
                Defeitos
              </TabsTrigger>
            </TabsList>

            {/* Filtros */}
            <div className="flex gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={filter.search || ''}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9 bg-gray-800/50 border-gray-700/50 text-gray-200 placeholder:text-gray-500"
                />
              </div>

              <Select value={filter.categoria} onValueChange={(categoria) => 
                setFilter(prev => ({ ...prev, categoria: categoria as TraitFilter['categoria'] }))
              }>
                <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700/50">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="fisico">Físico</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="sobrenatural">Sobrenatural</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="qualidades" className="flex-1 overflow-auto pr-2 space-y-3">
            <TraitsList 
              traits={filteredTraits}
              selectedTraits={selectedTraits}
              onTraitClick={handleTraitClick}
              onPointsChange={updateChosenPoints}
              isSelected={isSelected}
              getSelectedTrait={getSelectedTrait}
              type="qualidades"
            />
          </TabsContent>

          <TabsContent value="defeitos" className="flex-1 overflow-auto pr-2 space-y-3">
            <TraitsList 
              traits={filteredTraits}
              selectedTraits={selectedTraits}
              onTraitClick={handleTraitClick}
              onPointsChange={updateChosenPoints}
              isSelected={isSelected}
              getSelectedTrait={getSelectedTrait}
              type="defeitos"
            />
          </TabsContent>
        </Tabs>

        {/* Rodapé com botões */}
        <div className="flex items-center justify-between pt-6 border-t border-red-900/30">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Selecionado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border border-gray-600"></div>
              <span>Disponível</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            <Button 
              onClick={handleConfirm}
              disabled={!validation.isValid}
              className={clsx(
                "min-w-[140px] font-semibold",
                validation.isValid 
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700" 
                  : "bg-gray-700 text-gray-400"
              )}
            >
              {validation.isValid ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirmar
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Incompleto
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para listar os traits
interface TraitsListProps {
  traits: TraitItem[]
  selectedTraits: SelectedTrait[]
  onTraitClick: (trait: TraitItem) => void
  onPointsChange: (itemId: string, points: number) => void
  isSelected: (itemId: string) => boolean
  getSelectedTrait: (itemId: string) => SelectedTrait | undefined
  type: 'qualidades' | 'defeitos'
}

function TraitsList({ 
  traits, 
  onTraitClick, 
  onPointsChange, 
  isSelected, 
  getSelectedTrait,
  type
}: TraitsListProps) {
  return (
    <div className="space-y-3">
      {traits.map(trait => (
        <TraitCard
          key={trait.id}
          trait={trait}
          selected={isSelected(trait.id)}
          selectedTrait={getSelectedTrait(trait.id)}
          onTraitClick={onTraitClick}
          onPointsChange={onPointsChange}
          type={type}
        />
      ))}

      {traits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            Nenhum {type.slice(0, -1)} encontrado
          </div>
          <div className="text-gray-600 text-sm">
            Tente ajustar os filtros de busca
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para cada trait individual
interface TraitCardProps {
  trait: TraitItem
  selected: boolean
  selectedTrait?: SelectedTrait
  onTraitClick: (trait: TraitItem) => void
  onPointsChange: (itemId: string, points: number) => void
  type: 'qualidades' | 'defeitos'
}

function TraitCard({ 
  trait, 
  selected, 
  selectedTrait,
  onTraitClick, 
  onPointsChange,
  type
}: TraitCardProps) {
  const resolved = resolvePoints(trait)
  const isQualidade = type === 'qualidades'

  return (
    <Card className={clsx(
      "group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
      "border-2 cursor-pointer overflow-hidden",
      selected 
        ? isQualidade
          ? "border-emerald-500/60 bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-emerald-950/40 shadow-emerald-500/20"
          : "border-red-500/60 bg-gradient-to-r from-red-950/40 via-red-900/20 to-red-950/40 shadow-red-500/20"
        : "border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-900/30 hover:border-gray-600/70"
    )}>
      {/* Indicador de seleção */}
      {selected && (
        <div className={clsx(
          "absolute top-0 left-0 w-1 h-full",
          isQualidade ? "bg-gradient-to-b from-emerald-400 to-emerald-600" : "bg-gradient-to-b from-red-400 to-red-600"
        )} />
      )}

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header com nome e badges */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h4 className={clsx(
                  "font-bold text-lg leading-tight",
                  selected 
                    ? isQualidade ? "text-emerald-200" : "text-red-200"
                    : "text-gray-200 group-hover:text-white"
                )}>
                  {trait.nome}
                </h4>
                
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <PointDisplay trait={trait} selected={selected} isQualidade={isQualidade} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="secondary" 
                  className={clsx(
                    "text-xs font-medium",
                    trait.categoria === 'fisico' && "bg-orange-900/50 text-orange-300 border-orange-700/50",
                    trait.categoria === 'mental' && "bg-blue-900/50 text-blue-300 border-blue-700/50",
                    trait.categoria === 'social' && "bg-purple-900/50 text-purple-300 border-purple-700/50",
                    trait.categoria === 'sobrenatural' && "bg-violet-900/50 text-violet-300 border-violet-700/50"
                  )}
                >
                  {trait.categoria}
                </Badge>
                
                {trait.clan && (
                  <Badge variant="outline" className="text-xs bg-gray-800/50 text-gray-400 border-gray-600/50">
                    {trait.clan}
                  </Badge>
                )}

                {trait.goldQuality && (
                  <Badge className="text-xs bg-yellow-900/50 text-yellow-300 border-yellow-700/50">
                    Especial
                  </Badge>
                )}
              </div>
            </div>

            {/* Descrição */}
            <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
              {trait.descricao}
            </p>

            {/* Restrições */}
            {(trait.restricoes && trait.restricoes.length > 0) && (
              <div className="bg-amber-950/30 border border-amber-800/50 rounded-md p-2">
                <p className="text-xs text-amber-300 flex items-start gap-1">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span><strong>Restrições:</strong> {trait.restricoes.join(', ')}</span>
                </p>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            {/* Seletor de pontos se necessário */}
            {(resolved.kind !== 'fixed' && selected) && (
              <PointSelector
                trait={trait}
                selectedPoints={selectedTrait?.chosenPoints || 0}
                onPointsChange={onPointsChange}
                isQualidade={isQualidade}
              />
            )}

            <Button
              size="sm"
              onClick={() => onTraitClick(trait)}
              className={clsx(
                "min-w-[100px] font-semibold transition-all duration-200",
                selected 
                  ? isQualidade
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500/50"
                    : "bg-red-600 hover:bg-red-700 text-white border-red-500/50"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600/50"
              )}
            >
              {selected ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-2" />
                  Selecionado
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3 mr-2" />
                  Selecionar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para exibir pontos
interface PointDisplayProps {
  trait: TraitItem
  selected: boolean
  isQualidade: boolean
}

function PointDisplay({ trait, selected, isQualidade }: PointDisplayProps) {
  const resolved = resolvePoints(trait)
  
  let pointsText = ''
  if (resolved.kind === 'fixed' && resolved.value !== undefined) {
    pointsText = `${resolved.value}`
  } else if (resolved.kind === 'range' && resolved.min !== undefined && resolved.max !== undefined) {
    pointsText = `${resolved.min}-${resolved.max}`
  } else if (resolved.kind === 'options' && resolved.options) {
    const absOptions = resolved.options.map(Math.abs)
    pointsText = `${Math.min(...absOptions)}-${Math.max(...absOptions)}`
  }

  return (
    <div className={clsx(
      "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border-2",
      selected
        ? isQualidade 
          ? "bg-emerald-900/50 text-emerald-300 border-emerald-500/50"
          : "bg-red-900/50 text-red-300 border-red-500/50"
        : "bg-gray-800/50 text-gray-400 border-gray-600/50"
    )}>
      <span className="font-mono">{pointsText}</span>
      <span className="text-xs opacity-75">pt{pointsText !== '1' ? 's' : ''}</span>
    </div>
  )
}

// Componente para seleção de pontos variáveis
interface PointSelectorProps {
  trait: TraitItem
  selectedPoints: number
  onPointsChange: (itemId: string, points: number) => void
  isQualidade: boolean
}

function PointSelector({ trait, selectedPoints, onPointsChange, isQualidade }: PointSelectorProps) {
  const resolved = resolvePoints(trait)
  const [open, setOpen] = useState(false)

  const handleSelect = (points: number) => {
    onPointsChange(trait.id, points)
    setOpen(false)
  }

  let options: number[] = []
  if (resolved.kind === 'range' && resolved.min !== undefined && resolved.max !== undefined) {
    options = Array.from(
      { length: resolved.max - resolved.min + 1 }, 
      (_, i) => resolved.min! + i
    )
  } else if (resolved.kind === 'options' && resolved.options) {
    options = resolved.options
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={clsx(
            "min-w-[80px] font-mono font-bold border-2 transition-all duration-200",
            isQualidade
              ? "bg-emerald-900/30 text-emerald-300 border-emerald-500/50 hover:bg-emerald-800/50"
              : "bg-red-900/30 text-red-300 border-red-500/50 hover:bg-red-800/50"
          )}
        >
          {Math.abs(selectedPoints)} pt{Math.abs(selectedPoints) !== 1 ? 's' : ''}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-gray-800 border-gray-700">
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-400 px-2 py-1">
            Escolha os pontos:
          </div>
          {options.map(option => (
            <Button
              key={option}
              variant="ghost"
              size="sm"
              onClick={() => handleSelect(option)}
              className={clsx(
                "w-full justify-start text-sm transition-all duration-200",
                Math.abs(selectedPoints) === Math.abs(option) 
                  ? isQualidade
                    ? "bg-emerald-600/30 text-emerald-300 font-semibold"
                    : "bg-red-600/30 text-red-300 font-semibold"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <span className="font-mono mr-2">{Math.abs(option)}</span>
              ponto{Math.abs(option) !== 1 ? 's' : ''}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}