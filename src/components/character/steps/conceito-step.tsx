'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Arquetipo, CharacterDraft } from '@/types/character-creation'
import { Character, Chronicle } from '@/types'
import { CharacterDataService } from '@/services/character-data'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AccordionItem } from '@/components/ui/accordion-item'

interface ConceitoStepProps {
  character: Partial<Character>
  chronicle: Chronicle
  onChange: (updates: Partial<Character>) => void
}

export default function ConceitoStep({ character, chronicle, onChange }: ConceitoStepProps) {
  const [naturezas, setNaturezas] = useState<Arquetipo[]>([])
  const [comportamentos, setComportamentos] = useState<Arquetipo[]>([])
  const [filteredNaturezas, setFilteredNaturezas] = useState<Arquetipo[]>([])
  const [filteredComportamentos, setFilteredComportamentos] = useState<Arquetipo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadArquetipos()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNaturezas(naturezas)
      setFilteredComportamentos(comportamentos)
    } else {
      const filtered = naturezas.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredNaturezas(filtered)

      const filteredComp = comportamentos.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredComportamentos(filteredComp)
    }
  }, [searchTerm, naturezas, comportamentos])

  const loadArquetipos = async () => {
    setLoading(true)
    try {
      const [naturezasData, comportamentosData] = await Promise.all([
        CharacterDataService.getArquetipos('NATUREZA'),
        CharacterDataService.getArquetipos('COMPORTAMENTO')
      ])
      
      setNaturezas(naturezasData)
      setComportamentos(comportamentosData)
      setFilteredNaturezas(naturezasData)
      setFilteredComportamentos(comportamentosData)
    } catch (error) {
      console.error('Erro ao carregar arquétipos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    onChange({ [field]: value })
  }

  const handleNaturezaSelect = (natureza: Arquetipo) => {
    onChange({ nature: natureza.nome })
  }

  const handleComportamentoSelect = (comportamento: Arquetipo) => {
    onChange({ demeanor: comportamento.nome })
  }

  return (
    <div className="space-y-8">
      {/* Campos de texto básicos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Nome <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nome do personagem"
            value={character.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-black/50 border-red-800/50 text-white placeholder:text-red-300/60 focus:border-red-500 focus:ring-red-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="concept" className="text-white">
            Conceito <span className="text-destructive">*</span>
          </Label>
          <Input
            id="concept"
            placeholder="Ex: Empresário corrupto, Artista rebelde"
            value={character.concept || ''}
            onChange={(e) => handleInputChange('concept', e.target.value)}
            className="bg-black/50 border-red-800/50 text-white placeholder:text-red-300/60 focus:border-red-500 focus:ring-red-500/20"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sire" className="text-white">Senhor (Opcional)</Label>
        <Input
          id="sire"
          placeholder="Nome do vampiro que o abraçou"
          value={character.sire || ''}
          onChange={(e) => handleInputChange('sire', e.target.value)}
          className="bg-black/50 border-red-800/50 text-white placeholder:text-red-300/60 focus:border-red-500 focus:ring-red-500/20"
        />
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-300/60 h-4 w-4" />
        <Input
          placeholder="Buscar natureza ou comportamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/50 border-red-800/50 text-white placeholder:text-red-300/60 focus:border-red-500 focus:ring-red-500/20"
        />
      </div>

      {/* Listas lado a lado com altura limitada */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Lista de naturezas */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Naturezas
            <span className="text-sm text-red-300/70 font-normal">({filteredNaturezas.length})</span>
          </h3>
          {loading ? (
            <div className="text-red-300/70 text-center py-8">Carregando...</div>
          ) : (
            <div className="bg-black/30 border border-red-800/30 rounded-lg p-3 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredNaturezas.map((natureza) => (
                  <div
                    key={natureza.id}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all border
                      ${character.nature === natureza.nome 
                        ? 'bg-red-900/50 border-red-600/60 shadow-md' 
                        : 'bg-black/20 border-red-800/30 hover:bg-red-900/30 hover:border-red-700/50'
                      }
                    `}
                    onClick={() => handleNaturezaSelect(natureza)}
                  >
                    <div className="font-semibold text-white text-sm mb-1">{natureza.nome}</div>
                    {natureza.resumo && (
                      <div className="text-xs text-red-300/80 italic mb-2">"{natureza.resumo}"</div>
                    )}
                    <div className="text-xs text-red-200/70 leading-relaxed line-clamp-3">
                      {natureza.descricao || 'Descrição não disponível'}
                    </div>
                    {character.nature === natureza.nome && (
                      <div className="mt-2 pt-2 border-t border-red-700/30">
                        <div className="text-xs text-green-300 font-medium">✓ Selecionado</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista de comportamentos */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Comportamentos
            <span className="text-sm text-red-300/70 font-normal">({filteredComportamentos.length})</span>
          </h3>
          {loading ? (
            <div className="text-red-300/70 text-center py-8">Carregando...</div>
          ) : (
            <div className="bg-black/30 border border-red-800/30 rounded-lg p-3 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredComportamentos.map((comportamento) => (
                  <div
                    key={comportamento.id}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all border
                      ${character.demeanor === comportamento.nome 
                        ? 'bg-red-900/50 border-red-600/60 shadow-md' 
                        : 'bg-black/20 border-red-800/30 hover:bg-red-900/30 hover:border-red-700/50'
                      }
                    `}
                    onClick={() => handleComportamentoSelect(comportamento)}
                  >
                    <div className="font-semibold text-white text-sm mb-1">{comportamento.nome}</div>
                    {comportamento.resumo && (
                      <div className="text-xs text-red-300/80 italic mb-2">"{comportamento.resumo}"</div>
                    )}
                    <div className="text-xs text-red-200/70 leading-relaxed line-clamp-3">
                      {comportamento.descricao || 'Descrição não disponível'}
                    </div>
                    {character.demeanor === comportamento.nome && (
                      <div className="mt-2 pt-2 border-t border-red-700/30">
                        <div className="text-xs text-green-300 font-medium">✓ Selecionado</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumo das seleções */}
      {(character.nature || character.demeanor) && (
        <div className="bg-gradient-to-r from-red-950/40 to-black/40 border-2 border-red-800/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-semibold text-white">Arquétipos Selecionados</h3>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {character.nature && (
              <div className="p-4 bg-black/30 rounded-lg border border-red-800/30">
                <div className="text-red-300/70 text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  Natureza (Essência):
                </div>
                <div className="text-red-200 font-bold text-lg mb-2">{character.nature}</div>
                {/* Encontrar e mostrar resumo da natureza selecionada */}
                {(() => {
                  const selected = filteredNaturezas.find(n => n.nome === character.nature) || 
                                 naturezas.find(n => n.nome === character.nature);
                  return selected?.resumo && (
                    <div className="text-xs text-red-300/80 italic">"{selected.resumo}"</div>
                  );
                })()}
              </div>
            )}
            {character.demeanor && (
              <div className="p-4 bg-black/30 rounded-lg border border-red-800/30">
                <div className="text-red-300/70 text-sm font-medium mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  Comportamento (Máscara):
                </div>
                <div className="text-red-200 font-bold text-lg mb-2">{character.demeanor}</div>
                {/* Encontrar e mostrar resumo do comportamento selecionado */}
                {(() => {
                  const selected = filteredComportamentos.find(c => c.nome === character.demeanor) || 
                                 comportamentos.find(c => c.nome === character.demeanor);
                  return selected?.resumo && (
                    <div className="text-xs text-red-300/80 italic">"{selected.resumo}"</div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}