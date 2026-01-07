import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, X, Check, AlertCircle } from 'lucide-react';
import { TraitItem, SelectedTrait, TraitType } from '@/types/traits';
import { useTraitsSelection } from './useTraitsSelection';
import { loadTraitsDataset } from '@/lib/traits/loadDataset';

interface TraitsModalProps {
  isOpen: boolean;
  onClose: (selection?: SelectedTrait[]) => void;
  selectedTraits: SelectedTrait[];
  type?: TraitType; // Tornar opcional e com valor padrão
  mode?: 'both' | 'qualidades' | 'defeitos'; // Adicionar modo para controlar quais abas mostrar
}

const TraitsModal: React.FC<TraitsModalProps> = ({
  isOpen,
  onClose,
  selectedTraits,
  type = 'qualidade', // Valor padrão
  mode = 'both' // Valor padrão
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCostType, setSelectedCostType] = useState<string>('all');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [traits, setTraits] = useState<TraitItem[]>([]);
  
  const {
    selectedTraits: selection,
    addTrait,
    removeTrait,
    updateChosenPoints,
    setInitialSelection
  } = useTraitsSelection({
    storageKey: `traits-${type}`,
    initialSelection: selectedTraits
  });

  // Calculate totals
  const calculateTotals = () => {
    const qualidadeTraits = selection.filter(s => {
      const trait = traits.find(t => t.id === s.itemId);
      return trait?.tipo === 'qualidade';
    });
    
    const defeitoTraits = selection.filter(s => {
      const trait = traits.find(t => t.id === s.itemId);
      return trait?.tipo === 'defeito';
    });

    return {
      totalQualidades: qualidadeTraits.reduce((sum, s) => sum + s.chosenPoints, 0),
      totalDefeitos: defeitoTraits.reduce((sum, s) => sum + s.chosenPoints, 0),
      remainingQualidades: 7 - qualidadeTraits.reduce((sum, s) => sum + s.chosenPoints, 0),
      remainingDefeitos: 7 - defeitoTraits.reduce((sum, s) => sum + s.chosenPoints, 0)
    };
  };

  // Validate selection
  const validateSelection = () => {
    const totals = calculateTotals();
    const errors: string[] = [];

    if (totals.totalDefeitos < 7) {
      errors.push(`Precisa de ${7 - totals.totalDefeitos} pontos de defeitos`);
    }
    if (totals.totalQualidades > 7) {
      errors.push(`Excesso de ${totals.totalQualidades - 7} pontos de qualidades`);
    }

    return {
      isValid: errors.length === 0 && totals.totalDefeitos === 7 && totals.totalQualidades <= 7,
      errors
    };
  };

  // Load data and initialize selection
  React.useEffect(() => {
    console.log('TraitsModal useEffect:', { isOpen, selectedTraits: selectedTraits.length });
    if (isOpen) {
      console.log('Modal is open, loading traits dataset...');
      loadTraitsDataset().then((loadedTraits) => {
        console.log('Traits loaded successfully:', loadedTraits.length);
        setTraits(loadedTraits);
        setDataLoaded(true);
      }).catch(error => {
        console.error('Erro ao carregar traits:', error);
      });
      setInitialSelection(selectedTraits);
    }
  }, [isOpen, selectedTraits, setInitialSelection]);

  // Filtered traits
  const filteredTraits = useMemo(() => {
    if (!dataLoaded) return [];
    
    return traits.filter(trait => {
      // Filter by type - se mode for 'both', mostrar ambos os tipos
      if (mode === 'both') {
        // Mostrar qualidades e defeitos
        if (trait.tipo !== 'qualidade' && trait.tipo !== 'defeito') return false;
      } else if (mode === 'qualidades') {
        if (trait.tipo !== 'qualidade') return false;
      } else if (mode === 'defeitos') {
        if (trait.tipo !== 'defeito') return false;
      } else {
        // Fallback para o tipo especificado
        if (trait.tipo !== type) return false;
      }
      
      const matchesSearch = trait.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          trait.descricao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || trait.categoria === selectedCategory;
      const matchesCost = selectedCostType === 'all' || 
                         (selectedCostType === 'fixo' && trait.custo.valor !== undefined) ||
                         (selectedCostType === 'variavel' && trait.custo.minimo !== undefined);
      
      return matchesSearch && matchesCategory && matchesCost;
    });
  }, [traits, searchTerm, selectedCategory, selectedCostType, dataLoaded, type, mode]);

  // Categories for filter
  const availableCategories = useMemo(() => {
    let filteredTraits = traits;
    
    if (mode === 'both') {
      filteredTraits = traits.filter(t => t.tipo === 'qualidade' || t.tipo === 'defeito');
    } else if (mode === 'qualidades') {
      filteredTraits = traits.filter(t => t.tipo === 'qualidade');
    } else if (mode === 'defeitos') {
      filteredTraits = traits.filter(t => t.tipo === 'defeito');
    } else {
      filteredTraits = traits.filter(t => t.tipo === type);
    }
    
    const categories = [...new Set(filteredTraits.map(t => t.categoria))];
    return categories.sort();
  }, [traits, type, mode]);

  const totals = calculateTotals();
  const validation = validateSelection();

  const handleTraitToggle = (trait: TraitItem, cost: number) => {
    const existing = selection.find(s => s.itemId === trait.id);
    if (existing) {
      removeTrait(trait.id);
    } else {
      addTrait({
        itemId: trait.id,
        chosenPoints: cost
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCostType('all');
    setActiveFilters([]);
  };

  const handleConfirm = () => {
    if (validation.isValid) {
      onClose(selection);
    }
  };

  if (!dataLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-red-950 to-black border-red-800/50">
          <DialogHeader>
            <DialogTitle className="text-white">Carregando Traits</DialogTitle>
            <DialogDescription className="text-red-200/70">
              Carregando dados de qualidades e defeitos...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-300/70">Carregando...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-red-950 via-black to-red-950 border-red-800/50">
        <DialogHeader className="border-b border-red-800/30 pb-4">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            Seleção de {mode === 'both' ? 'Qualidades e Defeitos' : mode === 'qualidades' ? 'Qualidades' : 'Defeitos'}
          </DialogTitle>
          <DialogDescription className="text-red-200/70">
            Selecione as {mode === 'both' ? 'qualidades (máx. 7 pts) e defeitos (exatamente 7 pts)' : mode === 'qualidades' ? 'qualidades para seu personagem (máximo 7 pontos)' : 'defeitos para seu personagem (exatamente 7 pontos)'} que definirão as características especiais do seu vampiro.
          </DialogDescription>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-6">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg border border-green-700/30">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                <span className="text-green-300 font-medium">Qualidades: {totals.totalQualidades}/7 pts</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg border border-red-700/30">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                <span className="text-red-300 font-medium">Defeitos: {totals.totalDefeitos}/7 pts</span>
              </div>
            </div>
            
            {!validation.isValid && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/50 px-3 py-1 rounded-lg border border-red-700/50">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-medium">{validation.errors[0]}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex gap-6 h-[calc(90vh-200px)]">
          {/* Lista Principal - 70% */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Controles de Busca e Filtro */}
            <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-red-800/30 mb-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" />
                  <Input
                    placeholder="Buscar qualidades e defeitos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/50 border-red-800/50 text-white placeholder:text-red-300/60 focus:border-red-500"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-black/50 border-red-800/50 text-white">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-red-800/50">
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    {availableCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedCostType} onValueChange={setSelectedCostType}>
                  <SelectTrigger className="w-32 bg-black/50 border-red-800/50 text-white">
                    <SelectValue placeholder="Custo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-red-800/50">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="fixo">Fixo</SelectItem>
                    <SelectItem value="variavel">Variável</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchTerm || selectedCategory !== 'all' || selectedCostType !== 'all') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="border-red-800/50 text-red-300 hover:bg-red-950/50 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
              
              {/* Filtros Ativos */}
              {activeFilters.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {activeFilters.map((filter, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-900/50 text-red-200 border border-red-700/50">
                      {filter}
                      <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => {
                        setActiveFilters(prev => prev.filter((_, i) => i !== index));
                      }} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de Traits */}
            <div className="flex-1 overflow-auto space-y-2">
              {filteredTraits.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-red-300/70">
                  <div className="text-center">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum trait encontrado</p>
                  </div>
                </div>
              ) : (
                filteredTraits.map((trait, index) => {
                  const isSelected = selection.some(s => s.itemId === trait.id);
                  const selectedTrait = selection.find(s => s.itemId === trait.id);
                  const cost = selectedTrait?.chosenPoints || trait.custo.valor || trait.custo.minimo || 1;
                  const isQualidade = trait.tipo === 'qualidade';
                  
                  // Usar índice como fallback para garantir unicidade
                  const uniqueKey = `${trait.id}-${index}`;

                  return (
                    <div
                      key={uniqueKey}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer group hover:shadow-lg ${
                        isSelected
                          ? isQualidade
                            ? 'bg-green-950/30 border-green-700/70 shadow-green-900/20'
                            : 'bg-red-950/30 border-red-700/70 shadow-red-900/20'
                          : 'bg-black/20 border-gray-700/50 hover:border-gray-600/70 hover:bg-black/30'
                      }`}
                      onClick={() => handleTraitToggle(trait, cost)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white group-hover:text-gray-100">
                              {trait.nome}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  isQualidade
                                    ? 'bg-green-900/50 text-green-300 border-green-700/50'
                                    : 'bg-red-900/50 text-red-300 border-red-700/50'
                                }`}
                              >
                                {trait.categoria}
                              </Badge>
                              {isSelected && (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            {trait.descricao}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className={`text-lg font-bold px-3 py-1 rounded-lg shadow-sm ${
                            isQualidade
                              ? 'text-green-200 bg-green-800/70 border border-green-600/50'
                              : 'text-red-200 bg-red-800/70 border border-red-600/50'
                          }`}>
                            {trait.custo.valor ? (
                              `${trait.custo.valor} pt${trait.custo.valor !== 1 ? 's' : ''}`
                            ) : (
                              `${trait.custo.minimo}-${trait.custo.maximo} pts`
                            )}
                          </div>
                          
                          {isSelected && trait.custo.minimo && trait.custo.maximo && (
                            <Select
                              value={cost.toString()}
                              onValueChange={(value) => updateChosenPoints(trait.id, parseInt(value))}
                            >
                              <SelectTrigger className="w-20 h-8 text-xs bg-black/50 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-600">
                                {Array.from(
                                  { length: trait.custo.maximo! - trait.custo.minimo! + 1 },
                                  (_, i) => trait.custo.minimo! + i
                                ).map(value => (
                                  <SelectItem key={value} value={value.toString()}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar - 30% */}
          <div className="w-80 flex flex-col bg-black/30 rounded-lg border border-red-800/30 overflow-hidden">
            <div className="p-4 bg-red-950/30 border-b border-red-800/30">
              <h3 className="font-semibold text-white mb-3">Resumo da Seleção</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-200/70">Qualidades</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${Math.min(100, (totals.totalQualidades / 7) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {totals.totalQualidades}/7
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-200/70">Defeitos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{ width: `${Math.min(100, (totals.totalDefeitos / 7) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {totals.totalDefeitos}/7
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {selection.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-red-300/50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-800/30">
                      <span className="text-red-400 text-lg font-bold">!</span>
                    </div>
                    <p className="text-sm">Nenhum trait selecionado</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {selection.map((selectedTrait, index) => {
                    const trait = traits.find(t => t.id === selectedTrait.itemId);
                    if (!trait) return null;
                    
                    const isQualidade = trait.tipo === 'qualidade';
                    const uniqueKey = `selected-${selectedTrait.itemId}-${index}`;
                    
                    return (
                      <div
                        key={uniqueKey}
                        className={`p-3 rounded-lg border ${
                          isQualidade
                            ? 'bg-green-950/30 border-green-700/50'
                            : 'bg-red-950/30 border-red-700/50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm truncate">
                              {trait.nome}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              {trait.categoria}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-sm font-medium ${
                              isQualidade ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {selectedTrait.chosenPoints}pts
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTrait(trait.id);
                              }}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1 hover:bg-red-950/30 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-red-800/30 bg-red-950/20">
              <div className="flex gap-2">
                <button
                  onClick={() => onClose()}
                  className="px-4 py-2 text-sm font-medium text-red-300 hover:text-white border border-red-800/50 rounded-lg hover:bg-red-950/50 transition-colors flex-1"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={totals.totalDefeitos !== 7 || totals.totalQualidades > 7}
                  className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors flex-1 ${
                    totals.totalDefeitos === 7 && totals.totalQualidades <= 7
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {totals.totalDefeitos === 7 && totals.totalQualidades <= 7
                    ? 'Confirmar'
                    : `Faltam ${7 - totals.totalDefeitos} pts de Defeitos`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TraitsModal;
export { TraitsModal };